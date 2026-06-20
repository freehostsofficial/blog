/**
 * Calculates estimated reading time from an MDX content string.
 * @param content - The raw MDX body text (without frontmatter)
 * @returns Reading time in minutes (word count / 200, rounded up, minimum 1)
 */
function stripHtmlTagsIteratively(input: string): string {
  let current = input;
  let previous: string;
  do {
    previous = current;
    current = current.replace(/<[^>]*>/g, '');
  } while (current !== previous);
  return current;
}

export function calculateReadingTime(content: string): number {
  const text = stripHtmlTagsIteratively(
    content
      .replace(/```[\s\S]*?```/g, '')    // strip code blocks
      .replace(/`[^`]*`/g, '')           // strip inline code
      .replace(/!\[.*?\]\(.*?\)/g, '')   // strip images
      .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // keep link text
      .replace(/import\s+.*?$/gm, '')    // strip import statements
      .replace(/export\s+.*?$/gm, '')    // strip export statements
  ).trim();

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
