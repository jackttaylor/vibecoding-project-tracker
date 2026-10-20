import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: true });

// Links open in a new tab; sanitiser strips anything unsafe.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
  // GFM checklist boxes are read-only; give them an accessible name.
  if (node.tagName === 'INPUT' && node.getAttribute('type') === 'checkbox') {
    node.setAttribute('aria-label', node.hasAttribute('checked') ? 'Completed' : 'Not completed');
  }
});

export function renderMarkdown(src) {
  return DOMPurify.sanitize(marked.parse(src || ''));
}
