/**
 * Post-build cleanup script.
 * Removes content source files and other sensitive data from the static output
 * so raw markdown/MDX files are never deployed publicly.
 */
import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.resolve(__dirname, '..', 'out');

// Directories/files to remove from the output
const REMOVE = [
  'content',           // raw MDX source files
  'scripts',           // build scripts
];

let removed = 0;

for (const target of REMOVE) {
  const full = path.join(OUT_DIR, target);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
    console.log(`🧹 Removed: out/${target}`);
    removed++;
  }
}

if (removed === 0) {
  console.log('✅ No sensitive files found in output — clean build.');
} else {
  console.log(`✅ Cleaned ${removed} item(s) from static output.`);
}
