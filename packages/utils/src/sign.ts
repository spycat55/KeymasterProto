// @ts-nocheck
/* eslint-disable */
import { deterministicMarshal } from "./encode";
import { Envelope } from "@spycat55/keymaster_proto";
import PrivateKey from "@bsv/sdk/primitives/PrivateKey";
import { sha256 } from "@bsv/sdk/primitives/Hash";
import { Buffer } from "buffer";
import { sign as ecdsaSign } from "@bsv/sdk/primitives/ECDSA";
import { toHex } from "@bsv/sdk/primitives/utils";
import BigNumber from "@bsv/sdk/primitives/BigNumber";

export function signEnvelope(env: Envelope, priv: PrivateKey): void {
  const clone: Envelope = { ...env, signature: Buffer.alloc(0), signatureAlgo: "" } as Envelope;
  const sigInput = deterministicMarshal(clone);
  const digest = sha256(sigInput);
  const digestBN = new BigNumber(toHex(digest), 16);
  const sigObj = ecdsaSign(digestBN, priv, true);
  const der = sigObj.toDER();
  env.signature = Buffer.from(der);
  env.signatureAlgo = "ECDSA_SECP256K1_SHA256";
} 