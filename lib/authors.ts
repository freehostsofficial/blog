import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type { Author } from '@/types';

const authorsDir = path.join(process.cwd(), 'content', 'authors');

/**
 * Returns all author YAML files as typed Author[].
 * @returns Array of all authors sorted alphabetically by name
 */
export function getAllAuthors(): Author[] {
  if (!fs.existsSync(authorsDir)) return [];

  const files = fs.readdirSync(authorsDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(authorsDir, file), 'utf-8');
    const data = yaml.load(raw) as Author;
    return data;
  }).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns one author by slug or throws a build-time error if not found.
 * @param slug - The author slug (matches the YAML filename without extension)
 * @returns The author data
 * @throws Error if no author file exists for the given slug
 */
export function getAuthorBySlug(slug: string): Author {
  const filePath = path.join(authorsDir, `${slug}.yaml`);
  const fallbackPath = path.join(authorsDir, `${slug}.yml`);

  let targetPath = filePath;
  if (!fs.existsSync(filePath)) {
    if (fs.existsSync(fallbackPath)) {
      targetPath = fallbackPath;
    } else {
      throw new Error(
        `[BUILD ERROR] Author "${slug}" not found. Expected file at ${filePath}. ` +
        `Check that the author slug in your post frontmatter matches a file in /content/authors/.`
      );
    }
  }

  const raw = fs.readFileSync(targetPath, 'utf-8');
  return yaml.load(raw) as Author;
}
