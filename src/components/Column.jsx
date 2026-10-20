import { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from 'lucide-react';
import TaskCard from './TaskCard';
import { Button, IconButton, fieldClass } from './ui';

export default function Column({
  column,
  index,
  columnCount,
  tasks,
  isDoneColumn,
  dragState,
  cardProps,
  onRename,
  onDelete,
  onShift,
  onAddTask,
  onDragOverColumn,
  onDrop,
  emptyText = 'Nothing to display.',
}) {
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState(column.title);
  const headingId = `col-heading-${column.id}`;
  const isDropTarget = dragState.overColumn === column.id;

  const submitRename = (e) => {
    e.preventDefault();
    const v = draft.trim();
    if (v) onRename(v);
    setRenaming(false);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={`flex w-80 shrink-0 flex-col rounded-lg border bg-gray-50 transition-colors ${
        isDropTarget ? 'border-brand-accent bg-brand-accent/5' : 'border-gray-300'
      }`}
      onDragOver={onDragOverColumn}
      onDrop={onDrop}
    >
      <header className="flex items-center gap-1 border-b border-gray-300 px-3 py-2">
        {renaming ? (
          <form onSubmit={submitRename} className="flex flex-1 items-center gap-1">
            <label htmlFor={`rename-${column.id}`} className="sr-only">
              Column name
            </label>
            <input
              id={`rename-${column.id}`}
              autoFocus
              className={`${fieldClass} !py-1`}
              value={draft}
              maxLength={40}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setRenaming(false)}
            />
            <Button variant="primary" type="submit" className="!px-2 !py-1">
              Save
            </Button>
          </form>
        ) : (
          <>
            <h2 id={headingId} className="flex-1 truncate text-heading font-semibold uppercase tracking-wide">
              {column.title}
              <span className="ml-2 rounded-full bg-black px-2 py-0.5 align-middle font-mono text-monospace text-white">
                <span className="sr-only">, </span>
                {tasks.length}
                <span className="sr-only"> tasks</span>
              </span>
            </h2>
            <IconButton label={`Move ${column.title} column left`} onClick={() => onShift(-1)} disabled={index === 0} className="disabled:opacity-30">
              <ChevronLeft size={16} aria-hidden="true" />
            </IconButton>
            <IconButton
              label={`Move ${column.title} column right`}
              onClick={() => onShift(1)}
              disabled={index === columnCount - 1}
              className="disabled:opacity-30"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </IconButton>
            <IconButton
              label={`Rename ${column.title} column`}
              onClick={() => {
                setDraft(column.title);
                setRenaming(true);
              }}
            >
              <Pencil size={16} aria-hidden="true" />
            </IconButton>
            <IconButton label={`Delete ${column.title} column`} onClick={onDelete} disabled={columnCount <= 1} className="disabled:opacity-30">
              <Trash2 size={16} aria-hidden="true" />
            </IconButton>
          </>
        )}
      </header>

      <ol className="flex min-h-[120px] flex-1 flex-col gap-3 p-3" aria-label={`${column.title} tasks`}>
        {tasks.length === 0 ? (
          <li className="flex flex-1 items-center justify-center rounded-lg border border-gray-400 px-3 py-8 text-center text-body text-text-muted">
            {emptyText}
          </li>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              isDone={isDoneColumn}
              isDragging={dragState.draggingId === t.id}
              showDropBefore={dragState.overColumn === column.id && dragState.beforeId === t.id && dragState.draggingId !== t.id}
              {...cardProps(t)}
            />
          ))
        )}
        {isDropTarget && dragState.beforeId === null && tasks.length > 0 && (
          <li className="h-1 rounded bg-brand-accent" aria-hidden="true" />
        )}
      </ol>

      <div className="px-3 pb-3">
        <Button variant="ghost" className="w-full !justify-start !border-gray-400" onClick={onAddTask}>
          <Plus size={16} aria-hidden="true" />
          Add task to {column.title}
        </Button>
      </div>
    </section>
  );
}