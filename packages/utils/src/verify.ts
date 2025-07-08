// @ts-nocheck
/* eslint-disable */
import { deterministicMarshal } from "./encode";
import { Envelope } from "@spycat55/keymaster_proto";
import { sha256 } from "@bsv/sdk/primitives/Hash";
import Signature from "@bsv/sdk/primitives/Signature";
import PublicKey from "@bsv/sdk/primitives/PublicKey";
import BigNumber from "@bsv/sdk/primitives/BigNumber";
import { verify as ecdsaVerify } from "@bsv/sdk/primitives/ECDSA";
import { toHex } from "@bsv/sdk/primitives/utils";
import PrivateKey from "@bsv/sdk/primitives/PrivateKey";
import { Buffer } from "buffer";

// anyone private key = 1（BRC-77）
const anyoneKey = new PrivateKey(1);

export function verifyEnvelope(env: Envelope): boolean {
  if (env.signatureAlgo !== "ECDSA_SECP256K1_SHA256") return false;
  // build sig input
  const clone: Envelope = { ...env, signature: Buffer.alloc(0), signatureAlgo: "" } as Envelope;
  const sigInput = deterministicMarshal(clone);
  const digest = sha256(sigInput);
  const sigObj = Signature.fromDER(env.signature);
  const digestBN = new BigNumber(toHex(digest), 16);
  // 使用消息发送者公钥验证
  const pubBytes = env.header?.fromPubkey ?? new Uint8Array();
  const pubKey = PublicKey.fromDER([...pubBytes]);
  const ok = ecdsaVerify(digestBN, sigObj, pubKey);
  return ok;
} 