import { useState } from 'react';
import { BookOpen, ExternalLink, FileText, MonitorPlay, Pencil, Presentation } from 'lucide-react';
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

  return (
    <li className="flex min-w-0 flex-col gap-2 rounded-lg border border-gray-300 bg-surface-card p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-primary text-black">
          <Icon size={18} aria-hidden="true" />
        </span>
        <h3 className="flex-1 text-body font-semibold">{anchor.label}</h3>
        {!editing && (
          <IconButton
            label={`${anchor.url ? 'Edit' : 'Add'} ${anchor.label} link`}
            onClick={() => {
              setDraft(anchor.url || '');
              setEditing(true);
            }}
          >
            <Pencil size={16} aria-hidden="true" />
          </IconButton>
        )}
      </div>

      {editing ? (
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
      ) : anchor.url ? (
        <a
          href={anchor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-w-0 items-center gap-1 text-body text-brand-accent-ink underline underline-offset-2 hover:text-black"
        >
          <span className="truncate">{anchor.url.replace(/^https?:\/\//, '')}</span>
          <ExternalLink size={14} className="shrink-0" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : (
        <p className="text-body text-text-muted">No link yet.</p>
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
