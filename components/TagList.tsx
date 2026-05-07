import Link from 'next/link';

interface TagListProps {
  tags: string[];
}

/** Row of #tag-name chips with sharp corners, each linking to /tags/[tag] */
export function TagList({ tags }: TagListProps) {
  return (
    <div className="tag-list">
      {tags.map((tag) => (
        <Link key={tag} href={`/tags/${tag}`} className="tag-chip">
          #{tag}
        </Link>
      ))}
    </div>
  );
}
