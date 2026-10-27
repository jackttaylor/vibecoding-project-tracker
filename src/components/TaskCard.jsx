import { Bug, Calendar, Copy, GripVertical, Mail, Sparkles, Bot } from 'lucide-react';
import { dueState, DUE_STYLES } from '../lib/due';
import { initials } from '../lib/constants';
import { IconButton } from './ui';

export function TypeBadge({ type }) {
  const isBug = type === 'bug';
  const Icon = isBug ? Bug : Sparkles;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-mono text-monospace font-semibold uppercase ${
        isBug ? 'bg-type-bug text-white' : 'bg-type-feature text-black'
      }`}
    >
      <Icon size={12} aria-hidden="true" />
      {isBug ? 'Bug' : 'Feature'}
    </span>
  );
}

const selectSm =
  'w-full min-w-0 rounded border border-gray-400 bg-white px-1.5 py-1 text-monospace text-black hover:border-gray-600';

export default function TaskCard({
  task,
  columns,
  users,
  isDone,
  isDragging,
  showDropBefore,
  onOpen,
  onMove,
  onHandoff,
  onCopy,
  onDragStart,
  onDragEnd,
  onKeyMove,
}) {
  const due = dueState(task, isDone);
  const dueStyle = DUE_STYLES[due.key];
  const owner = users.find((u) => u.id === task.assignee);
  const isBug = task.type === 'bug';
  const titleId = `task-title-${task.id}`;

  const handleCardClick = (e) => {
    if (e.target.closest('button, a, select, input, label')) return;
    onOpen();
  };

  // Keyboard alternative to drag-and-drop: Alt + arrows.
  const handleKeyDown = (e) => {
    if (!e.altKey) return;
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (map[e.key]) {
      e.preventDefault();
      onKeyMove(map[e.key]);
    }
  };

  return (
    <li className="relative">
      {showDropBefore && <div className="absolute -top-2 left-0 right-0 h-1 rounded bg-brand-accent" aria-hidden="true" />}
      <article
        aria-labelledby={titleId}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        data-task-id={task.id}
        className={`group relative cursor-pointer overflow-hidden rounded-lg border pl-4 pr-3 py-3 shadow-sm transition hover:border-brand-accent hover:shadow-md ${dueStyle.card} ${
          isDragging ? 'scale-[1.02] opacity-60 shadow-xl' : ''
        }`}
      >
        {/* M6 type stripe (colour + icon + label, never colour alone) */}
        <span
          className={`absolute inset-y-0 left-0 w-1.5 ${isBug ? 'bg-type-bug' : 'bg-type-feature'}`}
          aria-hidden="true"
        />

        <div className="mb-2 flex items-center gap-2">
          <TypeBadge type={task.type} />
          <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-monospace font-semibold ${dueStyle.chip}`}>
            <Calendar size={12} aria-hidden="true" />
            {due.label}
          </span>
          <GripVertical size={16} className="ml-auto text-text-muted" aria-hidden="true" />
        </div>

        <h3 id={titleId} className="text-body font-medium">
          <button
            type="button"
            onClick={onOpen}
            className="text-left hover:underline"
            aria-describedby={`task-hint-${task.id}`}
          >
            {task.title || 'Untitled task'}
          </button>
        </h3>
        <span id={`task-hint-${task.id}`} className="sr-only">
          Open details. Alt plus arrow keys move this card.
        </span>

        {task.description && <p className="mt-1 line-clamp-2 text-body text-text-muted">{task.description}</p>}

        {/* FR9 owner + contact */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-monospace font-semibold text-white"
            aria-hidden="true"
          >
            {owner ? initials(owner.name) : '?'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-monospace font-semibold">{owner ? owner.name : 'Unassigned'}</p>
            {owner && (
              <a
                href={`mailto:${owner.email}?subject=${encodeURIComponent(`Re: ${task.title}`)}`}
                className="flex min-w-0 items-center gap-1 text-monospace text-brand-accent underline underline-offset-2 hover:text-black"
              >
                <Mail size={12} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{owner.email}</span>
              </a>
            )}
          </div>
          {task.contextTool && (
            <span className="inline-flex items-center gap-1 rounded border border-gray-400 bg-white px-1.5 py-0.5 text-monospace">
              <Bot size={12} aria-hidden="true" />
              {task.contextTool}
            </span>
          )}
          <IconButton label={`Copy context for ${task.title}`} onClick={onCopy} className="bg-white/70">
            <Copy size={16} aria-hidden="true" />
          </IconButton>
        </div>

        {/* NFR1: move or hand off in two interactions without dragging */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-black/10 pt-2">
          <label className="block min-w-0">
            <span className="mb-0.5 block text-monospace text-text-muted">Move to</span>
            <select className={selectSm} value={task.status} onChange={(e) => onMove(e.target.value)}>
              {columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block min-w-0">
            <span className="mb-0.5 block text-monospace text-text-muted">Hand off to</span>
            <select className={selectSm} value={task.assignee || ''} onChange={(e) => onHandoff(e.target.value)}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </article>
    </li>
  );
}
