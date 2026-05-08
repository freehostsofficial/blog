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
        <h1>About {SITE_NAME}</h1>
      </div>
      <div className="about-content" style={{ padding: 0, maxWidth: '70ch' }}>
        <p>
          <strong>{SITE_NAME}</strong> is the editorial companion to{' '}
          <a href={PARENT_URL} target="_blank" rel="noopener noreferrer">freehosts.space</a> — the
          web&apos;s most comprehensive directory of free hosting providers. We cut through the noise
          to bring you honest, in-depth content about deploying projects without spending a penny.
        </p>

        <h2>Our Mission</h2>
        <p>
          Cost should never be a barrier to getting online. Whether you&apos;re a student shipping
          your first side project, a developer testing an idea, or a community organiser who needs a
          website — there&apos;s a free tier out there for you. Our job is to help you find it and
          make the most of it.
        </p>

        <h2>What We Write About</h2>
        <p>
          Every article falls into one of five categories:{' '}
          <strong>Guides</strong> with step-by-step deployment walkthroughs,{' '}
          <strong>Tutorials</strong> for picking up new skills,{' '}
          <strong>News</strong> covering industry changes and platform updates,{' '}
          <strong>Opinion</strong> offering our editorial take on the ecosystem, and{' '}
          <strong>Community</strong> spotlighting the people and projects that make free hosting
          thrive.
        </p>

        <h2>Who We Are</h2>
        <p>
          The blog is run by a small team of writers and editors who live and breathe web hosting.
          We test every platform we write about, and we&apos;re not afraid to call out the catches
          hiding behind a &ldquo;free&rdquo; label.
        </p>
        <p>
          <Link href="/authors">Meet our authors →</Link>
        </p>

        <h2>Get In Touch</h2>
        <p>
          Have a story idea, a correction, or just want to say hello? Reach out to us on{' '}
          <a href="https://x.com/freehosts" target="_blank" rel="noopener noreferrer">Twitter / X</a>{' '}
          — we read everything.
        </p>
      </div>
    </div>
  );
}
