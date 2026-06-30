import { cpSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'node_modules/cesium/Build/Cesium');
const dest = join(root, 'public/cesium');

if (!existsSync(source)) {
  console.warn('Cesium build assets not found; skipping copy.');
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
cpSync(source, dest, { recursive: true });
console.log('Copied Cesium assets to public/cesium');
