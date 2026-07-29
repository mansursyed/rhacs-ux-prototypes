#!/usr/bin/env node
/**
 * Fail the build if mock fixtures look like live/staging exports or secrets.
 * Denylist strings are assembled so a history rewrite of those literals cannot break this file.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'mocks');

const join = (...parts) => parts.join('');

const DENY_STRINGS = [
  join('eyJ'), // JWT header prefix (full shape checked via regex below)
  join('mid', '-', 'server'),
  join('service', '-', 'now'),
  join('staging', '-', 'secured', '-', 'cluster'),
  join('staging', '-', 'central', '-', 'cluster'),
  join('staging', '.', 'demo', '.', 'stackrox', '.', 'com'),
  join('e89f4ada', '-', '52b2', '-', '40cf', '-', '838b', '-', 'd1cf09ce6582'),
];

const DENY_REGEX = [
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  /Bearer\s+(?!\[DEMO_REDACTED\]|\[REDACTED\])\S+/i,
  /BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY/,
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
  for (const re of DENY_REGEX) {
    if (re.test(text)) {
      hits.push(`${path.relative(root, file)} matches ${re}`);
    }
  }
  for (const s of DENY_STRINGS) {
    if (s === 'eyJ') continue; // covered by JWT regex
    if (text.includes(s)) {
      hits.push(`${path.relative(root, file)} contains denylisted string`);
    }
  }
}

if (hits.length) {
  console.error('Unsafe mock content detected:\n' + hits.map((h) => ` - ${h}`).join('\n'));
  process.exit(1);
}

console.log(`Mock safety check passed (${files.length} JSON files).`);
