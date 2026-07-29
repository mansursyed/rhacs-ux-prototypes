#!/usr/bin/env node
/**
 * Fail the build if mock fixtures look like live/staging exports or secrets.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'mocks');

const DENY = [
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  /Bearer\s+(?!\[DEMO_REDACTED\]|\[REDACTED\])\S+/i,
  /BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY/,
  /\b***REMOVED***\b/i,
  /\b***REMOVED***\b/i,
  /\bstaging\.demo\.stackrox\.com\b/i,
  /\b***REMOVED***\b/i,
  /\b***REMOVED***\b/i,
  /\b***REMOVED***\b/i,
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else if (e.name.endsWith('.json')) files.push(p);
  }
  return files;
}

const files = await walk(root);
const hits = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const re of DENY) {
    if (re.test(text)) {
      hits.push(`${path.relative(root, file)} matches ${re}`);
    }
  }
}

if (hits.length) {
  console.error('Unsafe mock content detected:\n' + hits.map((h) => ` - ${h}`).join('\n'));
  process.exit(1);
}

console.log(`Mock safety check passed (${files.length} JSON files).`);
