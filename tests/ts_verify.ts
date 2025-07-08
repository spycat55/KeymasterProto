// @ts-nocheck
/* bun test helper: verify envelope bytes */
import { Envelope, verifyEnvelope } from '../src/index';
import { readFileSync } from 'fs';

const inPath = process.argv[2];
if (!inPath) { console.error('usage: bun ts_verify.ts <file>'); process.exit(1); }
const buf = readFileSync(inPath);
const env = Envelope.decode(buf);
const ok = verifyEnvelope(env);
if (!ok) {
  console.error('verify failed');
  process.exit(1);
}
console.log('verify ok'); 