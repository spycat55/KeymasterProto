// @ts-nocheck
/* eslint-disable */
import { BinaryWriter } from "@bufbuild/protobuf/wire";
import { Envelope } from "@spycat55/keymaster_proto";

export function deterministicMarshal(env: Envelope): Uint8Array {
  // ts-proto BinaryWriter is deterministic wrt field order; direct encode is fine.
  return Envelope.encode(env, new BinaryWriter()).finish();
} 