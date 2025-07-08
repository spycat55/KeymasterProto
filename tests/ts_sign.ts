// @ts-nocheck
/* bun test helper: generate signed Envelope via TS utils */
import { Envelope, Header, WSSignaling, MsgKind } from '../ts/message';
import { signEnvelope } from '../utils_ts/sign';
import PrivateKey from '@bsv/sdk/primitives/PrivateKey';
import { writeFileSync } from 'fs';
import { Buffer } from 'buffer';

const outPath = process.argv[2];
if (!outPath) { console.error('usage: bun ts_sign.ts <outputfile>'); process.exit(1); }

// 随机私钥
const priv = PrivateKey.fromRandom();
const pub = priv.toPublicKey();

const payload = WSSignaling.create({ signalingType: 'offer', data: Buffer.from('hello') });
const header = Header.create({
  kind: MsgKind.KIND_WS_SIGNALING,
  messageId: 'abc',
  correlationId: '',
  ts: new Date(),
  fromPubkey: Buffer.from(pub.encode(true)),
});

const env = Envelope.create({ version: 1, header, wsSignaling: payload });
signEnvelope(env, priv);

const bytes = Envelope.encode(env).finish();
writeFileSync(outPath, Buffer.from(bytes));
console.log('written', bytes.length, 'bytes'); 