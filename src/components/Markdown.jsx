import { useMemo } from 'react';
import { renderMarkdown } from '../lib/markdown';

/** FR11: render context Markdown with formatting (sanitised). */
export default function Markdown({ source, className = '' }) {
  const html = useMemo(() => renderMarkdown(source), [source]);
  return (
    <div
      className={`prose prose-sm max-w-none text-black prose-headings:text-black prose-headings:font-semibold prose-h2:mt-4 prose-h2:mb-2 prose-h2:text-heading prose-a:text-brand-accent-ink prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:font-mono prose-code:text-monospace prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-brand-accent prose-blockquote:text-text-muted prose-strong:text-black ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
