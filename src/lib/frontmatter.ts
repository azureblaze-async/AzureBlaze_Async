import { parseDocument } from 'yaml';

// Only remove an explicit YAML envelope; article prose remains byte-for-byte unchanged.
export function parseFrontmatter(markdown: string): { content: string; data: Record<string, unknown> } {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n(?:---|\.\.\.)(?:\r?\n|$)/.exec(markdown);
  if (!match) return { content: markdown, data: {} };
  const doc = parseDocument(match[1] ?? '');
  if (doc.errors.length) throw new Error('Invalid article frontmatter');
  const value: unknown = doc.toJS();
  const data = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  return { content: markdown.slice(match[0].length), data };
}