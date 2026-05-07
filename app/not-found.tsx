import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>This page doesn&apos;t exist — it may have been moved or deleted.</p>
      <p style={{ marginTop: '1.5rem' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          ← Back to homepage
        </Link>
      </p>
    </div>
  );
}
