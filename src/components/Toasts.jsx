import { CheckCircle2 } from 'lucide-react';

/** Toast stack — 200 ms fade (DESIGN.md §7), announced politely to screen readers. */
export default function Toasts({ toasts }) {
  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
      role="status"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex animate-fadein items-center gap-2 rounded-md border border-black bg-black px-4 py-3 text-body text-white shadow-lg"
        >
          <CheckCircle2 size={18} className="text-type-feature" aria-hidden="true" />
          {t.message}
        </div>
      ))}
    </div>
  );
}
