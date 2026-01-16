import 'server-only';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * answers.enc is an AES-256-GCM encrypted JSON of shape:
 *   { byLen: { "4": ["...."], "5": ["....."], ... } }
 *
 * File format (base64 text in repo):
 *   base64( iv[12] || ciphertext[..] || tag[16] )
 *
 */

let cached: { byLen: Record<string, string[]> } | null = null;

function getKey() {
    const k = process.env.SASE_PUZZLE_ANSWERS_KEY || '';
    return /^[A-Za-z0-9+/=]+$/.test(k) ? Buffer.from(k, 'base64') : Buffer.from(k);
}

function readEncBlob(): Buffer {
    const p = path.join(process.cwd(), 'src', 'server', 'puzzle', 'answers.enc');
    const raw = fs.readFileSync(p, 'utf8').trim();
    return Buffer.from(raw, 'base64');
}

function decrypt(): { byLen: Record<string, string[]> } {
    const blob = readEncBlob();
    const iv = blob.subarray(0, 12);
    const tag = blob.subarray(blob.length - 16);
    const ciphertext = blob.subarray(12, blob.length - 16);
    const key = getKey();
    if (key.length !== 32) throw new Error('SASE_PUZZLE_ANSWERS_KEY must be 32 bytes');

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return JSON.parse(plain.toString('utf8'));
}

function ensureLoaded() {
    if (!cached) cached = decrypt();
    return cached!;
}

export function getAnswersForLen(len: number): string[] {
    const {byLen} = ensureLoaded();
    return byLen[String(len)] || [];
}
