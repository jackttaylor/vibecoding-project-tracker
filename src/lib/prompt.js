import { formatDate, formatTimestamp } from './constants';

/** M10: serialise a task + its context into a paste-ready Markdown briefing. */
export function buildPromptContext(task, { columns, users }) {
  const column = columns.find((c) => c.id === task.status);
  const owner = users.find((u) => u.id === task.assignee);
  const lines = [
    `# Task: ${task.title || 'Untitled task'}`,
    '',
    `- **Type:** ${task.type === 'bug' ? 'Bug' : 'Feature'}`,
    `- **Status:** ${column ? column.title : task.status}`,
    `- **Owner:** ${owner ? `${owner.name} <${owner.email}>` : 'Unassigned'}`,
    `- **Due:** ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}`,
    `- **Created:** ${formatDate(task.createdDate)}`,
  ];
  if (task.contextTool) lines.push(`- **AI tool used:** ${task.contextTool}`);
  if (task.contextUpdatedAt) lines.push(`- **Context last updated:** ${formatTimestamp(task.contextUpdatedAt)}`);

  lines.push('', '## Description', task.description?.trim() || '_No description._');
  lines.push('', '## Context', task.context?.trim() || '_No context recorded yet._');
  lines.push(
    '',
    '---',
    'You are picking up this task from a teammate. Read the context above, ask me anything that is unclear, then help me with the next step.',
  );
  return lines.join('\n');
}

/** Clipboard with a fallback for iframes / insecure contexts. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
