// @ts-nocheck
/* eslint-disable */
import { deterministicMarshal } from "./encode";
import { Envelope } from "../ts/message";
import { sha256 } from "@bsv/sdk/primitives/Hash";
import { verify as brc77Verify } from "@bsv/sdk/messages/SignedMessage";
import PrivateKey from "@bsv/sdk/primitives/PrivateKey";
import { Buffer } from "buffer";

// anyone private key 0..01 (BRC-77)
const anyoneKey = new PrivateKey(Buffer.alloc(32, 0).map((v, i) => (i === 31 ? 1 : 0)));

export function verifyEnvelope(env: Envelope): boolean {
  if (env.signatureAlgo !== "ECDSA_SECP256K1_SHA256") return false;
  // build sig input
  const clone: Envelope = { ...env, signature: Buffer.alloc(0), signatureAlgo: "" } as Envelope;
  const sigInput = deterministicMarshal(clone);
  const digest = sha256(sigInput);
  const ok = brc77Verify(digest, env.signature, anyoneKey);
  return ok;
} 