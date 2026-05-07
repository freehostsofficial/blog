import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, PARENT_URL, SITE_DESCRIPTION } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${SITE_NAME} — the official blog for freehosts.space.`,
};

export default function AboutPage() {
  return (
    <div className="section">
      <div className="page-header" style={{ padding: '0 0 1.5rem' }}>
        <h1>About This Blog</h1>
      </div>
      <div className="about-content" style={{ padding: 0, maxWidth: '70ch' }}>
        <p>
          <strong>{SITE_NAME}</strong> is the editorial companion to{' '}
          <a href={PARENT_URL} target="_blank" rel="noopener noreferrer">freehosts.space</a>, the web&apos;s
          most comprehensive directory of free hosting providers. We publish guides, tutorials,
          platform comparisons, community spotlights, and opinions about the free hosting ecosystem.
        </p>

        <h2>What We Cover</h2>
        <p>
          Our content spans five categories: <strong>Guides</strong> for step-by-step deployment
          walkthroughs, <strong>Tutorials</strong> for learning new skills, <strong>News</strong> for
          industry updates, <strong>Opinion</strong> for editorial perspectives, and{' '}
          <strong>Community</strong> for spotlighting the people and projects that make the free
          hosting ecosystem thrive.
        </p>

        <h2>Our Team</h2>
        <p>
          The blog is written by a small team of staff writers and editors who are passionate about
          making the web accessible to everyone. We believe that cost should never be a barrier to
          publishing on the internet.
        </p>
        <p>
          <Link href="/authors">Meet our authors →</Link>
        </p>

        <h2>Open Source</h2>
        <p>
          This blog is built with Next.js and deployed as a static site. The source code is open —
          we practice what we preach about free hosting and open-source tools. Every post is written
          in MDX and lives in the repository alongside the code.
        </p>

        <h2>Get In Touch</h2>
        <p>
          Have a story idea? Want to write for us? Found a bug? Open an issue on our GitHub
          repository or reach out on Twitter. We read everything.
        </p>
      </div>
    </div>
  );
}
