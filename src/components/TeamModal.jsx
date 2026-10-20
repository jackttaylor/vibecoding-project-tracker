import { useState } from 'react';
import { Trash2, UserPlus } from 'lucide-react';
import Modal from './Modal';
import { Button, IconButton, fieldClass } from './ui';
import { initials, uid } from '../lib/constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Manage the people tasks can be assigned to. User = { id, name, email (unique) }. */
export default function TeamModal({ users, onSave, onClose }) {
  const [rows, setRows] = useState(users);
  const [errors, setErrors] = useState({});

  const update = (id, key, value) => setRows((r) => r.map((u) => (u.id === id ? { ...u, [key]: value } : u)));

  const save = () => {
    const errs = {};
    const seen = new Map();
    rows.forEach((u) => {
      const email = u.email.trim().toLowerCase();
      if (!u.name.trim()) errs[`${u.id}-name`] = 'Name is required.';
      if (!EMAIL_RE.test(email)) errs[`${u.id}-email`] = 'Enter a valid email.';
      else if (seen.has(email)) errs[`${u.id}-email`] = 'This email is already used.';
      seen.set(email, u.id);
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave(rows.map((u) => ({ ...u, name: u.name.trim(), email: u.email.trim() })));
  };

  return (
    <Modal
      title="Team"
      onClose={onClose}
      footer={
        <>
          <Button onClick={() => setRows((r) => [...r, { id: uid(), name: '', email: '' }])}>
            <UserPlus size={16} aria-hidden="true" />
            Add member
          </Button>
          <Button className="ml-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save}>
            Save team
          </Button>
        </>
      }
    >
      <p className="mb-4 text-body text-text-muted">
        Owners appear on each card with their email so anyone can get in touch. Removing a member leaves their tasks unassigned.
      </p>
      {rows.length === 0 && <p className="rounded-md border border-gray-400 px-3 py-6 text-center text-body text-text-muted">Nothing to display.</p>}
      <ul className="flex flex-col gap-3">
        {rows.map((u, i) => (
          <li key={u.id} className="flex items-start gap-3 rounded-lg border border-gray-300 p-3">
            <span className="mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-monospace font-semibold text-white" aria-hidden="true">
              {initials(u.name)}
            </span>
            <div className="grid flex-1 grid-cols-2 gap-3">
              <div>
                <label htmlFor={`user-name-${u.id}`} className="mb-1 block text-body font-semibold">
                  Name
                </label>
                <input
                  id={`user-name-${u.id}`}
                  className={fieldClass}
                  value={u.name}
                  autoFocus={i === rows.length - 1 && !u.name}
                  onChange={(e) => update(u.id, 'name', e.target.value)}
                  aria-invalid={!!errors[`${u.id}-name`]}
                  aria-describedby={errors[`${u.id}-name`] ? `err-name-${u.id}` : undefined}
                />
                {errors[`${u.id}-name`] && (
                  <p id={`err-name-${u.id}`} className="mt-1 text-monospace font-semibold text-[#B91C1C]">
                    {errors[`${u.id}-name`]}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`user-email-${u.id}`} className="mb-1 block text-body font-semibold">
                  Email
                </label>
                <input
                  id={`user-email-${u.id}`}
                  type="email"
                  className={fieldClass}
                  value={u.email}
                  onChange={(e) => update(u.id, 'email', e.target.value)}
                  aria-invalid={!!errors[`${u.id}-email`]}
                  aria-describedby={errors[`${u.id}-email`] ? `err-email-${u.id}` : undefined}
                />
                {errors[`${u.id}-email`] && (
                  <p id={`err-email-${u.id}`} className="mt-1 text-monospace font-semibold text-[#B91C1C]">
                    {errors[`${u.id}-email`]}
                  </p>
                )}
              </div>
            </div>
            <IconButton label={`Remove ${u.name || 'member'}`} className="mt-6" onClick={() => setRows((r) => r.filter((x) => x.id !== u.id))}>
              <Trash2 size={16} aria-hidden="true" />
            </IconButton>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
