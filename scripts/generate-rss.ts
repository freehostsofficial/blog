import fs from 'fs';
import path from 'path';
import { generateRssFeed } from '../lib/rss';

const outDir = path.join(process.cwd(), 'public');
const rssPath = path.join(outDir, 'rss.xml');

const feed = generateRssFeed();
fs.writeFileSync(rssPath, feed, 'utf-8');
