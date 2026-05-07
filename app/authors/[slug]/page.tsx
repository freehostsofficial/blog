import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllAuthors, getAuthorBySlug } from '@/lib/authors';
import { getPostsByAuthor } from '@/lib/posts';
import { PostCard } from '@/components/PostCard';
import { SITE_URL } from '@/lib/config';

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const author = getAuthorBySlug(slug);
    return { title: author.name, description: `Posts by ${author.name} — ${author.role}` };
  } catch {
    return { title: 'Author Not Found' };
  }
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let author;
  try { author = getAuthorBySlug(slug); } catch { notFound(); }

  const posts = getPostsByAuthor(slug);
  const joinDate = new Date(author.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="section">
      <div className="author-profile">
        <img src={author.avatar} alt={author.name} className="author-profile-avatar" width={120} height={120} />
        <div className="author-profile-info">
          <h1>{author.name}</h1>
          <div className="author-profile-role">{author.role}</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)', margin: '0.25rem 0' }}>
            Joined {joinDate}
          </p>
          <div className="author-profile-links">
            {author.links?.github && <a href={author.links.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
            {author.links?.twitter && <a href={author.links.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
            {author.links?.website && <a href={author.links.website} target="_blank" rel="noopener noreferrer">Website</a>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '70ch', margin: '0 0 2rem', color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.7 }}>
        {author.bio}
      </div>

      <div className="section-label">{posts.length} {posts.length === 1 ? 'post' : 'posts'} published</div>
      {posts.map((post) => {
        const authors = post.authors.map((s) => getAuthorBySlug(s));
        return <PostCard key={post.slug} post={post} authors={authors} />;
      })}
    </div>
  );
}
