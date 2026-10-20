import { useState } from 'react';
import { BookOpen, CheckCircle2, CircleDashed, ExternalLink, FileText, MonitorPlay, Pencil, Presentation } from 'lucide-react';
import { Button, IconButton, fieldClass } from './ui';

const ICONS = { presentation: Presentation, demo: MonitorPlay, report: FileText, documentation: BookOpen };

function normaliseUrl(raw) {
  const v = raw.trim();
  if (!v) return null;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function AnchorSlot({ anchor, onSave }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(anchor.url || '');
  const Icon = ICONS[anchor.id] || FileText;
  const inputId = `anchor-${anchor.id}`;

  const save = (e) => {
    e.preventDefault();
    onSave(anchor.id, normaliseUrl(draft));
    setEditing(false);
  };

  const startEditing = () => {
    setDraft(anchor.url || '');
    setEditing(true);
  };

  // The whole slot body is one button: opens the link, or starts adding one.
  const body = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary text-black">
        <Icon size={18} aria-hidden="true" />
      </span>
      <span className="flex-1 truncate text-left text-body font-semibold">{anchor.label}</span>
      {/* Link status — icon + text, never colour alone */}
      {anchor.url ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-type-feature px-2 py-0.5 text-monospace font-semibold text-black">
          <CheckCircle2 size={14} aria-hidden="true" />
          Linked
          <ExternalLink size={12} aria-hidden="true" />
        </span>
      ) : (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-gray-400 bg-white px-2 py-0.5 text-monospace font-semibold text-text-muted">
          <CircleDashed size={14} aria-hidden="true" />
          Missing
        </span>
      )}
    </>
  );
  const bodyClass =
    'flex min-w-0 flex-1 items-center gap-2 rounded-md p-1 -m-1 hover:bg-brand-accent/10';

  return (
    <li className="flex min-w-0 flex-col gap-2 rounded-lg border border-gray-300 bg-surface-card p-3 shadow-sm hover:border-brand-accent">
      <div className="flex items-center gap-2">
        {anchor.url ? (
          <a
            href={anchor.url}
            target="_blank"
            rel="noopener noreferrer"
            className={bodyClass}
            aria-label={`Open ${anchor.label} (opens in a new tab)`}
            title={anchor.url}
          >
            {body}
          </a>
        ) : (
          <button
            type="button"
            className={bodyClass}
            onClick={startEditing}
            aria-label={`Add ${anchor.label} link, currently missing`}
            disabled={editing}
          >
            {body}
          </button>
        )}
        {anchor.url && !editing && (
          <IconButton label={`Edit ${anchor.label} link`} onClick={startEditing}>
            <Pencil size={16} aria-hidden="true" />
          </IconButton>
        )}
      </div>

      {editing && (
        <form onSubmit={save} className="flex flex-col gap-2">
          <label htmlFor={inputId} className="sr-only">
            {anchor.label} link
          </label>
          <input
            id={inputId}
            autoFocus
            className={fieldClass}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://…"
            onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}
          />
          <div className="flex gap-2">
            <Button variant="primary" type="submit" className="!px-3 !py-1">
              Save
            </Button>
            <Button className="!px-3 !py-1" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </li>
  );
}

/** FR15 / M11: pinned deliverables above the board. */
export default function AnchorBoard({ anchors, onSave }) {
  return (
    <section aria-labelledby="deliverables-heading" className="mb-6">
      <h2 id="deliverables-heading" className="mb-3 text-heading font-semibold uppercase tracking-wide">
        Deliverables
      </h2>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {anchors.map((a) => (
          <AnchorSlot key={a.id} anchor={a} onSave={onSave} />
        ))}
      </ul>
    </section>
  );
}