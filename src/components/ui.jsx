// Small shared UI primitives so buttons and fields look the same everywhere.

const base =
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-body font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  // DESIGN.md §4: rounded brand-primary fill with black text (6.0:1 contrast).
  primary: 'bg-brand-primary text-black hover:bg-[#ff6a50] border border-brand-primary',
  secondary: 'bg-white text-black border border-gray-400 hover:border-brand-accent hover:bg-brand-accent/10',
  danger: 'bg-white text-[#B91C1C] border border-[#B91C1C] hover:bg-[#B91C1C] hover:text-white',
  ghost: 'bg-transparent text-black hover:bg-brand-accent/10 border border-transparent',
};

export function Button({ variant = 'secondary', className = '', ...props }) {
  return <button type="button" className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function IconButton({ label, className = '', children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:bg-brand-accent/10 hover:text-black ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export const fieldClass =
  'w-full rounded-md border border-gray-400 bg-white px-3 py-2 text-body text-black placeholder:text-text-muted hover:border-gray-600';

export function Field({ label, htmlFor, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1 block text-body font-semibold">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-monospace text-text-muted">{hint}</p>}
    </div>
  );
}
