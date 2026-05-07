import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/tags';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Browse all topics covered on the blog.',
};

export default function TagsCloudPage() {
  const tags = getAllTags();
  const maxCount = Math.max(...tags.values(), 1);

  return (
    <div className="section">
      <div className="page-header" style={{ padding: '0 0 1.5rem' }}>
        <h1>Tags</h1>
        <div className="count">{tags.size} topics</div>
      </div>
      <div className="tag-cloud">
        {[...tags.entries()].map(([tag, count]) => {
          const scale = 0.85 + (count / maxCount) * 0.65;
          return (
            <Link key={tag} href={`/tags/${tag}`} style={{ fontSize: `${scale}rem` }}>
              #{tag} <sup style={{ fontSize: '0.6em', color: 'var(--border)' }}>{count}</sup>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
