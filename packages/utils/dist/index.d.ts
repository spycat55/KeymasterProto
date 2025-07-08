import { Envelope } from '@spycat55/keymaster_proto';
import PrivateKey from '@bsv/sdk/primitives/PrivateKey';

declare function deterministicMarshal(env: Envelope): Uint8Array;

declare function signEnvelope(env: Envelope, priv: PrivateKey): void;

declare function verifyEnvelope(env: Envelope): boolean;

export { deterministicMarshal, signEnvelope, verifyEnvelope };
