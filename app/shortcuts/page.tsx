import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keyboard Shortcuts',
  description: 'Keyboard shortcuts available across the blog.',
  alternates: { canonical: '/shortcuts' },
}

const shortcuts = [
  { key: '?', label: 'Toggle this cheat sheet' },
  { key: '⌘ / Ctrl + K', label: 'Open search' },
  { key: '/', label: 'Focus search' },
  { key: 'Alt + T', label: 'Toggle dark / light mode' },
  { key: 'Alt + H', label: 'Go to Home page' },
  { key: 'Alt + P', label: 'Go to Posts' },
  { key: 'Alt + A', label: 'Go to Archive' },
  { key: 'Alt + S', label: 'Go to Shortcuts page' },
  { key: 'Alt + R', label: 'Go to a random post' },
  { key: 'Esc', label: 'Close modals / dialogs' },
]

export default function ShortcutsPage() {
  return (
    <main id="main-content">
      <div className="container" style={{ paddingTop: 'var(--sp-16)', paddingBottom: 'var(--sp-24)' }}>
        <header className="page-header">
          <h1>Keyboard Shortcuts</h1>
          <p>Press <kbd className="search-kbd">?</kbd> at any time to toggle this reference.</p>
        </header>

        <div className="shortcuts-table-wrap">
          <table className="shortcuts-table">
            <thead>
              <tr>
                <th>Shortcut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map(s => (
                <tr key={s.key}>
                  <td><kbd className="search-kbd">{s.key}</kbd></td>
                  <td>{s.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
