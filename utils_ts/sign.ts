// @ts-nocheck
/* eslint-disable */
import { deterministicMarshal } from "./encode";
import { Envelope } from "../ts/message";
import PrivateKey from "@bsv/sdk/primitives/PrivateKey";
import { sha256 } from "@bsv/sdk/primitives/Hash";
import { sign as brc77Sign } from "@bsv/sdk/messages/SignedMessage";
import { Buffer } from "buffer";

export function signEnvelope(env: Envelope, priv: PrivateKey): void {
  const clone: Envelope = { ...env, signature: Buffer.alloc(0), signatureAlgo: "" } as Envelope;
  const sigInput = deterministicMarshal(clone);
  const digest = sha256(sigInput);
  const sigBytes = brc77Sign(digest, priv, undefined);
  env.signature = Buffer.from(sigBytes);
  env.signatureAlgo = "ECDSA_SECP256K1_SHA256";
} 