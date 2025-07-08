import { BinaryWriter, BinaryReader } from '@bufbuild/protobuf/wire';
import PrivateKey from '@bsv/sdk/primitives/PrivateKey';

declare const protobufPackage = "api.webrtc.v1";
declare enum MsgKind {
    KIND_UNSPECIFIED = 0,
    KIND_ERROR = 1,
    /**
     * KIND_WS_SIGNALING - KIND_RTC_FILE_QUOTE = 3;
     *   KIND_RTC_FILE_CONTENT = 4;
     */
    KIND_WS_SIGNALING = 2,
    UNRECOGNIZED = -1
}
declare function msgKindFromJSON(object: any): MsgKind;
declare function msgKindToJSON(object: MsgKind): string;
interface Header {
    kind: MsgKind;
    /** 全局唯一 ID */
    messageId: string;
    /** 关联请求/响应 ID */
    correlationId: string;
    /** 发送时间 */
    ts?: Date | undefined;
    /** 发送方公钥 */
    fromPubkey: Uint8Array;
    /** 接收方公钥 */
    toPubkey: Uint8Array;
}
declare const Header: MessageFns<Header>;
interface Envelope {
    /** 协议版本 */
    version: number;
    header?: Header | undefined;
    /** 安全字段（必填） */
    signature: Uint8Array;
    /** 如 "ECDSA_P256_SHA256" */
    signatureAlgo: string;
    errorReply?: ErrorReply | undefined;
    /**
     * RTCFileQuote rtc_file_quote = 7;
     * RTCFileContent rtc_file_content = 8;
     */
    wsSignaling?: WSSignaling | undefined;
}
declare const Envelope: MessageFns<Envelope>;
interface ErrorReply {
    /** 字符串形式的错误码 */
    errorCode: string;
    detail: string;
}
declare const ErrorReply: MessageFns<ErrorReply>;
interface WSSignaling {
    /** offer, candidate */
    signalingType: string;
    /** SDP / ICE / 其他 */
    data: Uint8Array;
}
declare const WSSignaling: MessageFns<WSSignaling>;
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}

declare function deterministicMarshal(env: Envelope): Uint8Array;

declare function signEnvelope(env: Envelope, priv: PrivateKey): void;

declare function verifyEnvelope(env: Envelope): boolean;

export { type DeepPartial, Envelope, ErrorReply, type Exact, Header, type MessageFns, MsgKind, WSSignaling, deterministicMarshal, msgKindFromJSON, msgKindToJSON, protobufPackage, signEnvelope, verifyEnvelope };
