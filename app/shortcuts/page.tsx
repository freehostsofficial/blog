import type { Metadata } from 'next'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Kbd } from '@/components/ui/kbd'

export const metadata: Metadata = {
  title: 'Keyboard Shortcuts',
  description: 'Keyboard shortcuts available across the blog.',
  alternates: { canonical: '/shortcuts' },
}

const shortcuts = [
  { key: '?', label: 'Toggle this cheat sheet' },
  { key: '⌘K / Ctrl+K', label: 'Open search' },
  { key: '/', label: 'Focus search' },
  { key: 'Alt+T', label: 'Toggle dark / light mode' },
  { key: 'Alt+H', label: 'Go to Home page' },
  { key: 'Alt+P', label: 'Go to Posts' },
  { key: 'Alt+A', label: 'Go to Archive' },
  { key: 'Alt+S', label: 'Go to Shortcuts page' },
  { key: 'Alt+R', label: 'Go to a random post' },
  { key: 'Esc', label: 'Close modals / dialogs' },
]

export default function ShortcutsPage() {
  return (
    <main id="main-content">
      <div className="container-blog py-16 pb-24">
        <header className="pb-8 mb-10 border-b border-glass-border">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Keyboard Shortcuts</h1>
          <p className="text-muted-foreground">Press <Kbd>?</Kbd> at any time to toggle this reference.</p>
        </header>

        <div className="glass rounded-xl overflow-hidden max-w-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">Shortcut</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shortcuts.map(s => (
                <TableRow key={s.key}>
                  <TableCell><Kbd>{s.key}</Kbd></TableCell>
                  <TableCell className="text-muted-foreground">{s.label}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}
