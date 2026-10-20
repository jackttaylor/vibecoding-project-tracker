// FR10 / M8 due-tint. Thresholds from DESIGN.md §2:
//   overdue  — past the due date
//   warning  — due within the next 48 hours (DESIGN says "<24h"; the 24–48h gap
//              between "warning" and "safe (>2 days)" is treated as warning)
//   safe     — more than 2 days out
//   neutral  — task is in the Done column (overrides the date)
//   none     — no due date set

const HOUR = 36e5;

export function dueState(task, isDone, now = new Date()) {
  if (isDone) return { key: 'neutral', label: 'Done' };
  if (!task.dueDate) return { key: 'none', label: 'No due date' };

  const [y, m, d] = task.dueDate.split('-').map(Number);
  const endOfDue = new Date(y, m - 1, d, 23, 59, 59, 999);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayDiff = Math.round((new Date(y, m - 1, d) - startOfToday) / (24 * HOUR));
  const hoursLeft = (endOfDue - now) / HOUR;

  if (hoursLeft < 0) {
    const n = Math.max(1, -dayDiff);
    return { key: 'overdue', label: `Overdue by ${n} day${n === 1 ? '' : 's'}` };
  }
  if (hoursLeft <= 48) {
    return { key: 'warning', label: dayDiff === 0 ? 'Due today' : dayDiff === 1 ? 'Due tomorrow' : 'Due in 2 days' };
  }
  return { key: 'safe', label: `Due in ${dayDiff} days` };
}

// Full class strings so Tailwind's JIT picks them up.
// Chip text colour is chosen per background to keep ≥4.5:1 contrast.
export const DUE_STYLES = {
  safe:    { card: 'bg-due-safe/10 border-due-safe',       chip: 'bg-due-safe text-black' },
  warning: { card: 'bg-due-warning/15 border-due-warning', chip: 'bg-due-warning text-black' },
  overdue: { card: 'bg-due-overdue/10 border-due-overdue', chip: 'bg-due-overdue text-white' },
  neutral: { card: 'bg-due-neutral/10 border-due-neutral', chip: 'bg-due-neutral text-black' },
  none:    { card: 'bg-surface-card border-gray-300',      chip: 'bg-gray-100 text-text-muted border border-gray-300' },
};
