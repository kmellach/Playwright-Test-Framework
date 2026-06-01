import fs from 'fs';
import path from 'path';

// Simple .env loader (no external dependency)
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  });
}

export const BASE_URL = process.env.BASE_URL || 'https://parabank.parasoft.com';

export function full(pathname: string): string {
  if (!pathname) return BASE_URL;
  if (pathname.startsWith('http')) return pathname;
  if (!pathname.startsWith('/')) pathname = '/' + pathname;
  return BASE_URL + pathname;
}

export default { BASE_URL, full };
