import { useCallback, useMemo, useRef, useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import AnchorBoard from './components/AnchorBoard';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import TeamModal from './components/TeamModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toasts from './components/Toasts';
import { Button, fieldClass } from './components/ui';
import { useLocalStorage } from './lib/useLocalStorage';
import { buildPromptContext, copyText } from './lib/prompt';
import {
  CONTEXT_TEMPLATE,
  DEFAULT_ANCHORS,
  DEFAULT_COLUMNS,
  DEFAULT_USERS,
  STORAGE_KEYS,
  makeSeedTasks,
  toISODate,
  uid,
} from './lib/constants';

export { STAGES } from './lib/constants';
export { useLocalStorage } from './lib/useLocalStorage';

const byPosition = (a, b) => (a.position ?? 0) - (b.position ?? 0);
const EMPTY_DRAG = { draggingId: null, overColumn: null, beforeId: null };

export default function App() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, makeSeedTasks);
  const [columns, setColumns] = useLocalStorage(STORAGE_KEYS.columns, DEFAULT_COLUMNS);
  const [users, setUsers] = useLocalStorage(STORAGE_KEYS.users, DEFAULT_USERS);
  const [anchors, setAnchors] = useLocalStorage(STORAGE_KEYS.anchors, DEFAULT_ANCHORS);

  const [modal, setModal] = useState(null); // {kind:'task', task, isNew} | {kind:'team'}
  const [confirm, setConfirm] = useState(null); // {title, message, onConfirm}
  const [toasts, setToasts] = useState([]);
  const [announcement, setAnnouncement] = useState('');
  const [drag, setDrag] = useState(EMPTY_DRAG);
  const [query, setQuery] = useState('');
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const dragRef = useRef(EMPTY_DRAG);

  const sortedColumns = useMemo(() => [...columns].sort(byPosition), [columns]);
  const doneColumnId = useMemo(
    () => (columns.some((c) => c.id === 'done') ? 'done' : sortedColumns[sortedColumns.length - 1]?.id),
    [columns, sortedColumns],
  );
  const userName = (id) => users.find((u) => u.id === id)?.name;

  // ---------- feedback ----------
  const toast = useCallback((message) => {
    const id = uid();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  const announce = (msg) => {
    setAnnouncement('');
    requestAnimationFrame(() => setAnnouncement(msg));
  };

  // ---------- task ops ----------
  const moveTask = useCallback(
    (id, toCol, beforeId = null) => {
      setTasks((prev) => {
        const task = prev.find((t) => t.id === id);
        if (!task) return prev;
        const others = prev.filter((t) => t.id !== id);
        const target = others.filter((t) => t.status === toCol).sort(byPosition);
        let idx = beforeId ? target.findIndex((t) => t.id === beforeId) : target.length;
        if (idx < 0) idx = target.length;
        target.splice(idx, 0, { ...task, status: toCol });
        const reindexed = target.map((t, i) => ({ ...t, position: i }));
        return [...others.filter((t) => t.status !== toCol), ...reindexed];
      });
    },
    [setTasks],
  );

  const tasksIn = (colId) => tasks.filter((t) => t.status === colId).sort(byPosition);

  const handoff = (task, userId) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, assignee: userId } : t)));
    toast(userId ? `Task assigned to ${userName(userId)}` : 'Task unassigned.');
  };

  const copyContext = async (task) => {
    const ok = await copyText(buildPromptContext(task, { columns, users }));
    toast(ok ? 'Context copied.' : "Couldn't copy — your browser blocked the clipboard.");
  };

  const openNewTask = (status = sortedColumns[0]?.id) => {
    setModal({
      kind: 'task',
      isNew: true,
      task: {
        id: uid(),
        title: '',
        description: '',
        type: 'feature',
        status,
        assignee: users[0]?.id || '',
        dueDate: null,
        createdDate: toISODate(),
        position: 0,
        context: CONTEXT_TEMPLATE,
        contextTool: null,
        contextUpdatedAt: null,
      },
    });
  };

  const saveTask = (draft) => {
    const original = tasks.find((t) => t.id === draft.id);
    const contextChanged = !original || original.context !== draft.context || original.contextTool !== draft.contextTool;
    const next = {
      ...draft,
      contextUpdatedAt: contextChanged && (draft.context.trim() || draft.contextTool) ? new Date().toISOString() : draft.contextUpdatedAt,
    };
    if (!original || original.status !== next.status) {
      setTasks((prev) => [...prev.filter((t) => t.id !== next.id), { ...next, position: Number.MAX_SAFE_INTEGER }]);
      moveTask(next.id, next.status, null); // re-index into its column at the end
    } else {
      setTasks((prev) => prev.map((t) => (t.id === next.id ? next : t)));
    }
    setModal(null);
    if (original && original.assignee !== next.assignee) {
      toast(next.assignee ? `Task assigned to ${userName(next.assignee)}` : 'Task unassigned.');
    } else {
      toast(original ? 'Task saved.' : 'Task created.');
    }
  };

  const requestDeleteTask = (task) => {
    setConfirm({
      title: 'Delete task',
      message: 'Confirm deletion of task.',
      onConfirm: () => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        setConfirm(null);
        setModal(null);
        toast('Task deleted.');
      },
    });
  };

  const keyMove = (task, dir) => {
    const colIdx = sortedColumns.findIndex((c) => c.id === task.status);
    const colTasks = tasksIn(task.status);
    const pos = colTasks.findIndex((t) => t.id === task.id);
    let msg = '';
    if (dir === 'left' || dir === 'right') {
      const target = sortedColumns[colIdx + (dir === 'left' ? -1 : 1)];
      if (!target) return;
      moveTask(task.id, target.id, null);
      msg = `Moved to ${target.title}.`;
    } else {
      const swapWith = colTasks[pos + (dir === 'up' ? -1 : 1)];
      if (!swapWith) return;
      const beforeId = dir === 'up' ? swapWith.id : colTasks[pos + 2]?.id ?? null;
      moveTask(task.id, task.status, beforeId);
      msg = `Position ${pos + (dir === 'up' ? 0 : 2)} of ${colTasks.length}.`;
    }
    announce(msg);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.querySelector(`[data-task-id="${task.id}"] h3 button`)?.focus()),
    );
  };

  // ---------- drag & drop (FR6) ----------
  const updateDrag = (next) => {
    const cur = dragRef.current;
    if (cur.draggingId === next.draggingId && cur.overColumn === next.overColumn && cur.beforeId === next.beforeId) return;
    dragRef.current = next;
    setDrag(next);
  };

  const onDragOverColumn = (colId) => (e) => {
    if (!dragRef.current.draggingId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const cards = [...e.currentTarget.querySelectorAll('[data-task-id]')].filter(
      (el) => el.dataset.taskId !== dragRef.current.draggingId,
    );
    const before = cards.find((el) => {
      const r = el.getBoundingClientRect();
      return e.clientY < r.top + r.height / 2;
    });
    updateDrag({ ...dragRef.current, overColumn: colId, beforeId: before ? before.dataset.taskId : null });
  };

  const onDrop = (colId) => (e) => {
    e.preventDefault();
    const { draggingId, beforeId } = dragRef.current;
    if (draggingId) {
      const task = tasks.find((t) => t.id === draggingId);
      moveTask(draggingId, colId, beforeId);
      if (task && task.status !== colId) announce(`Moved to ${columns.find((c) => c.id === colId)?.title}.`);
    }
    updateDrag(EMPTY_DRAG);
  };

  // ---------- column ops (FR1) ----------
  const addColumn = (e) => {
    e.preventDefault();
    const title = newColumnTitle.trim();
    if (!title) return;
    setColumns((prev) => [...prev, { id: uid(), title, position: prev.length }]);
    setNewColumnTitle('');
    setAddingColumn(false);
    toast(`Column "${title}" added.`);
  };

  const renameColumn = (id, title) => setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));

  const shiftColumn = (id, dir) => {
    const list = [...sortedColumns];
    const i = list.findIndex((c) => c.id === id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setColumns(list.map((c, idx) => ({ ...c, position: idx })));
  };

  const requestDeleteColumn = (col) => {
    const remaining = sortedColumns.filter((c) => c.id !== col.id);
    const fallback = remaining[0];
    const count = tasksIn(col.id).length;
    setConfirm({
      title: 'Delete column',
      message:
        count > 0
          ? `Delete "${col.title}"? Its ${count} task${count === 1 ? '' : 's'} will move to "${fallback.title}".`
          : `Delete "${col.title}"? You can't undo this.`,
      onConfirm: () => {
        setTasks((prev) => prev.map((t) => (t.status === col.id ? { ...t, status: fallback.id, position: 1e6 + (t.position ?? 0) } : t)));
        setColumns(remaining.map((c, idx) => ({ ...c, position: idx })));
        setConfirm(null);
        toast(`Column "${col.title}" deleted.`);
      },
    });
  };

  // ---------- team ----------
  const saveTeam = (next) => {
    const ids = new Set(next.map((u) => u.id));
    setUsers(next);
    setTasks((prev) => prev.map((t) => (t.assignee && !ids.has(t.assignee) ? { ...t, assignee: '' } : t)));
    setModal(null);
    toast('Team saved.');
  };

  // ---------- render ----------
  const q = query.trim().toLowerCase();
  const matches = (t) =>
    !q || [t.title, t.description, t.context, userName(t.assignee)].some((s) => s && s.toLowerCase().includes(q));

  const cardProps = (task) => ({
    columns: sortedColumns,
    users,
    onOpen: () => setModal({ kind: 'task', isNew: false, task }),
    onMove: (colId) => {
      moveTask(task.id, colId, null);
      announce(`Moved to ${columns.find((c) => c.id === colId)?.title}.`);
    },
    onHandoff: (userId) => handoff(task, userId),
    onCopy: () => copyContext(task),
    onDragStart: (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', task.id);
      updateDrag({ draggingId: task.id, overColumn: task.status, beforeId: null });
    },
    onDragEnd: () => updateDrag(EMPTY_DRAG),
    onKeyMove: (dir) => keyMove(task, dir),
  });

  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      <a
        href="#board"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to board
      </a>

      <header className="border-b-4 border-brand-primary bg-white">
        <div className="flex flex-wrap items-center gap-4 px-6 py-4">
          <div className="mr-auto">
            <h1 className="text-title font-semibold text-brand-primary">Kanban Board</h1>
            <p className="text-body text-text-muted">Tasks and the prompts behind them, in one place.</p>
          </div>
          <div className="relative">
            <label htmlFor="search" className="sr-only">
              Search tasks
            </label>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input
              id="search"
              type="search"
              placeholder="Search tasks"
              className={`${fieldClass} !w-60 pl-9`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setModal({ kind: 'team' })}>
            <Users size={16} aria-hidden="true" />
            Team
          </Button>
          <Button variant="primary" onClick={() => openNewTask()}>
            <Plus size={16} aria-hidden="true" />
            New Task
          </Button>
        </div>
      </header>

      <main className="px-6 py-6">
        <AnchorBoard anchors={anchors} onSave={(id, url) => setAnchors((prev) => prev.map((a) => (a.id === id ? { ...a, url } : a)))} />

        <section aria-labelledby="board-heading">
          <div className="mb-3 flex items-baseline gap-3">
            <h2 id="board-heading" className="text-heading font-semibold uppercase tracking-wide">
              Board
            </h2>
            <p className="text-monospace text-text-muted">Drag cards between columns, or focus a card and press Alt + arrow keys.</p>
          </div>
          <div id="board" tabIndex={-1} className="flex items-start gap-4 overflow-x-auto pb-4">
            {sortedColumns.map((col, i) => (
              <Column
                key={col.id}
                column={col}
                index={i}
                columnCount={sortedColumns.length}
                tasks={tasksIn(col.id).filter(matches)}
                isDoneColumn={col.id === doneColumnId}
                dragState={drag}
                cardProps={cardProps}
                onRename={(title) => renameColumn(col.id, title)}
                onDelete={() => requestDeleteColumn(col)}
                onShift={(dir) => shiftColumn(col.id, dir)}
                onAddTask={() => openNewTask(col.id)}
                onDragOverColumn={onDragOverColumn(col.id)}
                onDrop={onDrop(col.id)}
              />
            ))}

            <div className="w-72 shrink-0">
              {addingColumn ? (
                <form onSubmit={addColumn} className="flex flex-col gap-2 rounded-lg border border-gray-300 p-3">
                  <label htmlFor="new-column" className="text-body font-semibold">
                    Column name
                  </label>
                  <input
                    id="new-column"
                    autoFocus
                    maxLength={40}
                    className={fieldClass}
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && setAddingColumn(false)}
                  />
                  <div className="flex gap-2">
                    <Button variant="primary" type="submit">
                      Add column
                    </Button>
                    <Button onClick={() => setAddingColumn(false)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <Button className="w-full" onClick={() => setAddingColumn(true)}>
                  <Plus size={16} aria-hidden="true" />
                  Add column
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      {modal?.kind === 'task' && (
        <TaskModal
          key={modal.task.id}
          initial={modal.task}
          isNew={modal.isNew}
          columns={sortedColumns}
          users={users}
          onSave={saveTask}
          onDelete={() => requestDeleteTask(modal.task)}
          onCopy={copyContext}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.kind === 'team' && <TeamModal users={users} onSave={saveTeam} onClose={() => setModal(null)} />}
      {confirm && <ConfirmDialog {...confirm} onCancel={() => setConfirm(null)} />}

      <Toasts toasts={toasts} />
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}
