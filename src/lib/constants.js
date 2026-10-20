// Shared constants, seed data and small helpers.

// The four default columns (PRD §7). FR3: the board starts with these.
// Columns are editable (FR1), so Task.status holds a column id.
export const STAGES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

export const DEFAULT_COLUMNS = STAGES.map((s, i) => ({ id: s.id, title: s.label, position: i }));

// PRD §8. User = { id, name, email (unique) }. Editable from the Team dialog.
export const DEFAULT_USERS = [
  { id: 'jackttaylor', name: 'Jack Taylor', email: 'jackttaylor@btinternet.com' },
];

export const AI_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other'];

export const DEFAULT_ANCHORS = [
  { id: 'presentation', label: 'Presentation', url: null },
  { id: 'demo', label: 'Demo', url: null },
  { id: 'report', label: 'Report', url: null },
  { id: 'documentation', label: 'Documentation', url: null },
];

// FR13: prefilled template for the Context field.
export const CONTEXT_TEMPLATE = `## Goal
What this task should achieve, in one or two sentences.

## Done so far
-

## Current blocker
None yet.

## Key files
- \`src/App.jsx\`

## Prompt that worked
> Paste the prompt that produced the working code here.

## Next step
- [ ] `;

export const STORAGE_KEYS = {
  tasks: 'vibetracker.tasks',
  columns: 'vibetracker.columns',
  users: 'vibetracker.users',
  anchors: 'vibetracker.anchors',
  filters: 'vibetracker.filters',
};

export function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Local-time ISO date 'YYYY-MM-DD' (toISOString would shift to UTC). */
export function toISODate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function daysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

export function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTimestamp(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?';
}

// Seed tasks — dates are relative to today so every due-date tint shows on first load.
export function makeSeedTasks() {
  const now = new Date().toISOString();
  return [
    {
      id: uid(), title: 'Build the four-column board', type: 'feature', status: 'done',
      description: 'Render columns from state and group cards by status.',
      assignee: 'jackttaylor', dueDate: daysFromToday(-2), createdDate: daysFromToday(-5), position: 0,
      context: `## Goal\nA board that renders every column and its cards from state.\n\n## Done so far\n- Columns render from \`columns\` state\n- Cards grouped by \`status\`\n\n## Prompt that worked\n> Build a React Kanban board with Tailwind. Columns come from an array; each card is filtered by \`status\`.`,
      contextTool: 'Claude', contextUpdatedAt: now,
    },
    {
      id: uid(), title: 'Copy as Prompt Context button', type: 'feature', status: 'in-progress',
      description: 'Serialise a task and its context to Markdown and copy it to the clipboard.',
      assignee: 'jackttaylor', dueDate: daysFromToday(0), createdDate: daysFromToday(-2), position: 0,
      context: `## Goal\nOne click copies the task plus its context, ready to paste into an AI chat.\n\n## Current blocker\n\`navigator.clipboard\` is blocked inside some iframes — needs a fallback.\n\n## Next step\n- [ ] Add a \`textarea\` + \`execCommand('copy')\` fallback`,
      contextTool: 'ChatGPT', contextUpdatedAt: now,
    },
    {
      id: uid(), title: 'Cards lose order after refresh', type: 'bug', status: 'review',
      description: 'Dragging within a column does not persist the new position.',
      assignee: 'jackttaylor', dueDate: daysFromToday(-1), createdDate: daysFromToday(-3), position: 0,
      context: `## Done so far\n- Added a \`position\` field to each task\n- Re-index the target column on drop\n\n## Next step\n- [ ] Verify order survives a reload`,
      contextTool: 'Cursor', contextUpdatedAt: now,
    },
    {
      id: uid(), title: 'Deliverable anchor board', type: 'feature', status: 'todo',
      description: 'Pin Presentation, Demo, Report and Documentation links above the board.',
      assignee: 'jackttaylor', dueDate: daysFromToday(6), createdDate: daysFromToday(0), position: 0,
      context: '', contextTool: null, contextUpdatedAt: null,
    },
  ];
}