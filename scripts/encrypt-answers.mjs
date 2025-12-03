import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config as loadEnv } from 'dotenv';

const root = process.cwd();
loadEnv({ path: path.join(root, '.env') });
loadEnv({ path: path.join(root, '.env.local'), override: true });

const dir = process.argv[2];
if (!dir) {
    console.error('Usage: node scripts/encrypt-answers.mjs <folder-with-answers-txt>');
    process.exit(1);
}

function readList(p) {
    return fs.readFileSync(p, 'utf8')
        .split(/\r?\n/).map(s => s.trim().toLowerCase())
        .filter(Boolean).filter(s => /^[a-z]+$/.test(s));
}

const byLen = {};
for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^answers-(\d+)\.txt$/);
    if (!m) continue;
    const len = m[1];
    const words = readList(path.join(dir, f)).filter(w => w.length === Number(len));
    if (words.length) byLen[len] = Array.from(new Set(words));
}

if (!Object.keys(byLen).length) {
    console.error('No answers found.');
    process.exit(1);
}

const keyStr = process.env.SASE_PUZZLE_ANSWERS_KEY || '';
const key = /^[A-Za-z0-9+/=]+$/.test(keyStr) ? Buffer.from(keyStr, 'base64') : Buffer.from(keyStr);
if (key.length !== 32) {
    console.error('SASE_PUZZLE_ANSWERS_KEY must be 32 bytes (raw or base64)');
    process.exit(1);
}

const json = Buffer.from(JSON.stringify({ byLen }), 'utf8');
const iv = crypto.randomBytes(12);
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(json), cipher.final()]);
const tag = cipher.getAuthTag();
const out = Buffer.concat([iv, ciphertext, tag]).toString('base64');

const outPath = path.join(process.cwd(), 'src', 'server', 'puzzle', 'answers.enc');
fs.writeFileSync(outPath, out);
console.log('Wrote', outPath);
