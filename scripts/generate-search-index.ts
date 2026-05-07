import fs from 'fs';
import path from 'path';
import { generateSearchIndex } from '../lib/search';

const outDir = path.join(process.cwd(), 'public');
const indexPath = path.join(outDir, 'search-index.json');

const index = generateSearchIndex();
fs.writeFileSync(indexPath, JSON.stringify(index), 'utf-8');
