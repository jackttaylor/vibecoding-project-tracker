import { Bug, Search, Sparkles, X } from 'lucide-react';
import { AI_TOOLS } from '../lib/constants';
import { fieldClass } from './ui';

export const DEFAULT_FILTERS = { query: '', owner: 'any', type: 'all', due: 'any', tool: 'any' };

export function hasActiveFilters(f) {
  return Object.keys(DEFAULT_FILTERS).some((k) => (f[k] ?? DEFAULT_FILTERS[k]) !== DEFAULT_FILTERS[k]);
}

const selectClass = `${fieldClass} !w-auto !py-1.5`;

const TYPE_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'feature', label: 'Feature', Icon: Sparkles, on: 'bg-type-feature text-black' },
  { id: 'bug', label: 'Bug', Icon: Bug, on: 'bg-type-bug text-white' },
];

/** Search + filters for the board. Results count is announced to screen readers. */
export default function FilterBar({ filters, setFilters, users, shown, total }) {
  const f = { ...DEFAULT_FILTERS, ...filters };
  const set = (key, value) => setFilters((prev) => ({ ...DEFAULT_FILTERS, ...prev, [key]: value }));
  const active = hasActiveFilters(f);

  return (
    <div role="search" aria-label="Search and filter tasks" className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-gray-300 bg-gray-50 p-3">
      <div className="relative">
        <label htmlFor="filter-search" className="mb-1 block text-monospace font-semibold">
          Search
        </label>
        <Search size={16} className="pointer-events-none absolute bottom-2.5 left-3 text-text-muted" aria-hidden="true" />
        <input
          id="filter-search"
          type="search"
          placeholder="Title, description, context…"
          className={`${fieldClass} !w-64 !py-1.5 pl-9`}
          value={f.query}
          onChange={(e) => set('query', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="filter-owner" className="mb-1 block text-monospace font-semibold">
          Owner
        </label>
        <select id="filter-owner" className={selectClass} value={f.owner} onChange={(e) => set('owner', e.target.value)}>
          <option value="any">Anyone</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
          <option value="unassigned">Unassigned</option>
        </select>
      </div>

      <fieldset>
        <legend className="mb-1 block text-monospace font-semibold">Type</legend>
        <div className="flex overflow-hidden rounded-md border border-gray-400 bg-white">
          {TYPE_OPTIONS.map(({ id, label, Icon, on }) => {
            const pressed = f.type === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={pressed}
                onClick={() => set('type', id)}
                className={`inline-flex items-center gap-1 border-r border-gray-400 px-3 py-1.5 text-body font-medium last:border-r-0 ${
                  pressed ? on || 'bg-black text-white' : 'text-black hover:bg-brand-accent/10'
                }`}
              >
                {Icon && <Icon size={14} aria-hidden="true" />}
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="filter-due" className="mb-1 block text-monospace font-semibold">
          Due date
        </label>
        <select id="filter-due" className={selectClass} value={f.due} onChange={(e) => set('due', e.target.value)}>
          <option value="any">Any time</option>
          <option value="overdue">Overdue</option>
          <option value="soon">Due within 2 days</option>
          <option value="later">Due later</option>
          <option value="none">No due date</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-tool" className="mb-1 block text-monospace font-semibold">
          AI tool
        </label>
        <select id="filter-tool" className={selectClass} value={f.tool} onChange={(e) => set('tool', e.target.value)}>
          <option value="any">Any tool</option>
          {AI_TOOLS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
          <option value="none">No tool set</option>
        </select>
      </div>

      <div className="ml-auto flex items-center gap-3 self-center">
        <p className="text-body text-text-muted" aria-live="polite">
          Showing <strong className="text-black">{shown}</strong> of {total} tasks
        </p>
        {active && (
          <button
            type="button"
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-400 bg-white px-3 py-1.5 text-body font-medium hover:border-brand-accent hover:bg-brand-accent/10"
          >
            <X size={14} aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}