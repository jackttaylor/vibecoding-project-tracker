import { useState } from 'react';
import { Bug, Copy, FileText, Sparkles, Trash2 } from 'lucide-react';
import Modal from './Modal';
import Markdown from './Markdown';
import { Button, Field, fieldClass } from './ui';
import { AI_TOOLS, CONTEXT_TEMPLATE, formatTimestamp } from '../lib/constants';

export default function TaskModal({ initial, isNew, columns, users, onSave, onDelete, onCopy, onClose }) {
  const [form, setForm] = useState(initial);
  const [tab, setTab] = useState(isNew || !initial.context ? 'write' : 'preview');
  const [error, setError] = useState('');
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      setError('Give the task a title.');
      document.getElementById('task-title')?.focus();
      return;
    }
    onSave({ ...form, title: form.title.trim() });
  };

  const tabBtn = (id, label) => (
    <button
      type="button"
      role="tab"
      id={`ctx-tab-${id}`}
      aria-selected={tab === id}
      aria-controls={`ctx-panel-${id}`}
      tabIndex={tab === id ? 0 : -1}
      onClick={() => setTab(id)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const next = tab === 'write' ? 'preview' : 'write';
          setTab(next);
          document.getElementById(`ctx-tab-${next}`)?.focus();
        }
      }}
      className={`rounded-t-md border-b-2 px-3 py-1.5 text-body font-semibold ${
        tab === id ? 'border-brand-primary text-black' : 'border-transparent text-text-muted hover:text-black'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Modal
      title={isNew ? 'New Task' : 'Task details'}
      onClose={onClose}
      footer={
        <>
          {!isNew && (
            <Button variant="danger" onClick={onDelete}>
              <Trash2 size={16} aria-hidden="true" />
              Delete
            </Button>
          )}
          <Button onClick={() => onCopy(form)}>
            <Copy size={16} aria-hidden="true" />
            Copy as Prompt Context
          </Button>
          <Button className="ml-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            {isNew ? 'Create task' : 'Save changes'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <Field label="Title" htmlFor="task-title">
          <input
            id="task-title"
            data-autofocus
            className={fieldClass}
            value={form.title}
            onChange={(e) => {
              set('title')(e);
              if (error) setError('');
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'task-title-error' : undefined}
            required
            maxLength={120}
          />
          {error && (
            <p id="task-title-error" className="mt-1 text-body font-semibold text-[#B91C1C]" role="alert">
              {error}
            </p>
          )}
        </Field>

        <fieldset>
          <legend className="mb-1 text-body font-semibold">Type</legend>
          <div className="flex gap-2">
            {[
              { id: 'feature', label: 'Feature', Icon: Sparkles, on: 'bg-type-feature text-black border-type-feature' },
              { id: 'bug', label: 'Bug', Icon: Bug, on: 'bg-type-bug text-white border-type-bug' },
            ].map(({ id, label, Icon, on }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-body font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-primary ${
                  form.type === id ? on : 'border-gray-400 bg-white hover:border-brand-accent'
                }`}
              >
                <input type="radio" name="task-type" value={id} checked={form.type === id} onChange={set('type')} className="sr-only" />
                <Icon size={16} aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Column" htmlFor="task-status">
            <select id="task-status" className={fieldClass} value={form.status} onChange={set('status')}>
              {columns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Owner" htmlFor="task-assignee">
            <select id="task-assignee" className={fieldClass} value={form.assignee || ''} onChange={set('assignee')}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date" htmlFor="task-due">
            <input
              id="task-due"
              type="date"
              className={fieldClass}
              value={form.dueDate || ''}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value || null }))}
            />
          </Field>
        </div>

        <Field label="Description" htmlFor="task-desc">
          <textarea id="task-desc" rows={3} className={fieldClass} value={form.description} onChange={set('description')} />
        </Field>

        {/* M9 context */}
        <section aria-labelledby="ctx-heading" className="rounded-lg border border-gray-300">
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-300 px-3 pt-2">
            <h3 id="ctx-heading" className="mr-2 text-body font-semibold">
              Context
            </h3>
            <div role="tablist" aria-label="Context view" className="flex">
              {tabBtn('write', 'Write')}
              {tabBtn('preview', 'Preview')}
            </div>
            <div className="ml-auto flex items-center gap-2 pb-2">
              <label htmlFor="task-tool" className="text-body font-semibold">
                AI tool
              </label>
              <select
                id="task-tool"
                className={`${fieldClass} !w-auto !py-1`}
                value={form.contextTool || ''}
                onChange={(e) => setForm((f) => ({ ...f, contextTool: e.target.value || null }))}
              >
                <option value="">None</option>
                {AI_TOOLS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3">
            {tab === 'write' ? (
              <div role="tabpanel" id="ctx-panel-write" aria-labelledby="ctx-tab-write">
                <label htmlFor="task-context" className="sr-only">
                  Context (Markdown)
                </label>
                <textarea
                  id="task-context"
                  rows={10}
                  className={`${fieldClass} font-mono !text-monospace`}
                  value={form.context}
                  onChange={set('context')}
                  aria-describedby="ctx-hint"
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p id="ctx-hint" className="flex-1 text-monospace text-text-muted">
                    Markdown supported — headings, lists, <code>code</code>, links, checklists.
                  </p>
                  <Button
                    className="!px-3 !py-1"
                    onClick={() =>
                      setForm((f) => ({ ...f, context: f.context.trim() ? `${f.context.trimEnd()}\n\n${CONTEXT_TEMPLATE}` : CONTEXT_TEMPLATE }))
                    }
                  >
                    <FileText size={14} aria-hidden="true" />
                    Insert template
                  </Button>
                </div>
              </div>
            ) : (
              <div role="tabpanel" id="ctx-panel-preview" aria-labelledby="ctx-tab-preview" tabIndex={0}>
                {form.context.trim() ? (
                  <Markdown source={form.context} />
                ) : (
                  <p className="rounded-md border border-gray-400 px-3 py-6 text-center text-body text-text-muted">Nothing to display.</p>
                )}
              </div>
            )}
            {form.contextUpdatedAt && (
              <p className="mt-2 text-monospace text-text-muted">Context last updated {formatTimestamp(form.contextUpdatedAt)}</p>
            )}
          </div>
        </section>
        <button type="submit" className="hidden" tabIndex={-1} aria-hidden="true" />
      </form>
    </Modal>
  );
}
