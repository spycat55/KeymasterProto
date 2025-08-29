import { BinaryWriter, BinaryReader } from '@bufbuild/protobuf/wire';
import PrivateKey from '@bsv/sdk/primitives/PrivateKey';

declare const protobufPackage = "api.webrtc.v1";
declare enum MsgKind {
    KIND_UNSPECIFIED = 0,
    KIND_ERROR = 1,
    KIND_WS_SIGNALING = 2,
    /**
     * KIND_FILE_DEMAND_REQUEST - KIND_RTC_FILE_QUOTE = 3;
     *   KIND_RTC_FILE_CONTENT = 4;
     */
    KIND_FILE_DEMAND_REQUEST = 10,
    /** KIND_FILE_DEMAND_BROADCAST - 文件需求广播 */
    KIND_FILE_DEMAND_BROADCAST = 11,
    /** KIND_FEE_POOL_CREATE - 费用池创建 */
    KIND_FEE_POOL_CREATE = 12,
    /** KIND_FEE_POOL_SIGN - 费用池签名 */
    KIND_FEE_POOL_SIGN = 13,
    /** KIND_FEE_POOL_BASE_TX - 发送基础交易 */
    KIND_FEE_POOL_BASE_TX = 14,
    /** KIND_FEE_POOL_UPDATE - 费用池更新 */
    KIND_FEE_POOL_UPDATE = 15,
    /** KIND_FEE_POOL_UPDATE_NOTIFY - 费用池更新通知（服务器发送给客户端） */
    KIND_FEE_POOL_UPDATE_NOTIFY = 16,
    /** KIND_FEE_POOL_CLOSE - 费用池关闭 */
    KIND_FEE_POOL_CLOSE = 17,
    /** KIND_FEE_POOL_STATUS_QUERY - 费用池状态查询 */
    KIND_FEE_POOL_STATUS_QUERY = 18,
    /** KIND_FEE_POOL_STATUS_RESPONSE - 费用池状态响应 */
    KIND_FEE_POOL_STATUS_RESPONSE = 19,
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
    wsSignaling?: WSSignaling | undefined;
    /**
     * RTCFileQuote rtc_file_quote = 7;
     * RTCFileContent rtc_file_content = 8;
     */
    fileDemandRequest?: FileDemandRequest | undefined;
    fileDemandBroadcast?: FileDemandBroadcast | undefined;
    feePoolCreate?: FeePoolCreate | undefined;
    feePoolSign?: FeePoolSign | undefined;
    feePoolBaseTx?: FeePoolBaseTx | undefined;
    feePoolUpdate?: FeePoolUpdate | undefined;
    feePoolUpdateNotify?: FeePoolUpdateNotify | undefined;
    feePoolClose?: FeePoolClose | undefined;
    feePoolStatusQuery?: FeePoolStatusQuery | undefined;
    feePoolStatusResponse?: FeePoolStatusResponse | undefined;
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
/** 费用池创建消息 */
interface FeePoolCreate {
    /** 花费交易 */
    spendTx: Uint8Array;
    /** 输入总金额 */
    inputAmount: number;
    /** 客户端签名 */
    clientSignature: Uint8Array;
}
declare const FeePoolCreate: MessageFns<FeePoolCreate>;
/** 费用池签名消息，服务器返回给客户端 */
interface FeePoolSign {
    /** 花费交易ID（32 字节，小端序；十六进制展示为大端序；必填且不可为空） */
    spendTxid: Uint8Array;
    /** 服务器签名（为空表示拒绝） */
    serverSignature: Uint8Array;
    /** 错误信息（为空表示批准） */
    errorMessage: string;
}
declare const FeePoolSign: MessageFns<FeePoolSign>;
/** 发送基础交易消息，客户端返回给服务器 */
interface FeePoolBaseTx {
    /** 花费交易ID（32 字节，小端序；十六进制展示为大端序；必填且不可为空） */
    spendTxid: Uint8Array;
    /** 基础交易 */
    baseTx: Uint8Array;
    /** 客户端对基础交易的签名 */
    clientSignature: Uint8Array;
}
declare const FeePoolBaseTx: MessageFns<FeePoolBaseTx>;
/** 费用池更新通知消息（服务器发送给客户端） */
interface FeePoolUpdateNotify {
    /** 花费交易ID（32 字节，小端序；十六进制展示为大端序；必填且不可为空） */
    spendTxid: Uint8Array;
    /** 序列号 */
    sequenceNumber: number;
    /** 服务器金额 */
    serverAmount: number;
    /** 交易费用 */
    fee: number;
}
declare const FeePoolUpdateNotify: MessageFns<FeePoolUpdateNotify>;
/** 费用池更新消息，在客户端主动关闭的时候，服务器也会发送给客户端，平时都是客户端发送给服务器，回应 FeePoolUpdateNotify */
interface FeePoolUpdate {
    /** 花费交易ID（32 字节，小端序；十六进制展示为大端序；必填且不可为空） */
    spendTxid: Uint8Array;
    /** 序列号，如果 sequence_number 为 ffffffff，则表示是关闭费用池 */
    sequenceNumber: number;
    /** 服务器金额 */
    serverAmount: number;
    /** 交易费用 */
    fee: number;
    /** 签名 */
    signature: Uint8Array;
}
declare const FeePoolUpdate: MessageFns<FeePoolUpdate>;
/** 费用池关闭消息，双方都可以发送 */
interface FeePoolClose {
    /** 花费交易ID（32 字节，小端序；十六进制展示为大端序；必填且不可为空） */
    spendTxid: Uint8Array;
    /** 服务器金额 */
    serverAmount: number;
    /** 交易费用 */
    fee: number;
    /** 签名 */
    signature: Uint8Array;
}
declare const FeePoolClose: MessageFns<FeePoolClose>;
/** 费用池状态查询消息 */
interface FeePoolStatusQuery {
    /** 花费交易ID（可选，为空则查询客户端所有费用池） */
    spendTxid: Uint8Array;
}
declare const FeePoolStatusQuery: MessageFns<FeePoolStatusQuery>;
/** 费用池状态响应消息 */
interface FeePoolStatusResponse {
    /** 花费交易ID（32 字节，小端序；十六进制展示为大端序；必填且不可为空） */
    spendTxid: Uint8Array;
    /** 状态：pending, signed, active, expired, closed, error */
    status: string;
    spendAmount: number;
    /** 服务器当前金额 */
    serverAmount: number;
    /** 交易费用 */
    fee: number;
    /** 当前序列号 */
    sequenceNumber: number;
    /** 创建时间 */
    createdAt?: Date | undefined;
    /** 过期时间（如果适用） */
    expiresAt?: Date | undefined;
    /** 错误原因（状态为error时） */
    errorReason: string;
}
declare const FeePoolStatusResponse: MessageFns<FeePoolStatusResponse>;
/** 文件需求请求消息 */
interface FileDemandRequest {
    /** 文件哈希 */
    fileHash: Uint8Array;
}
declare const FileDemandRequest: MessageFns<FileDemandRequest>;
/** 文件需求广播消息 */
interface FileDemandBroadcast {
    /** 文件哈希 */
    fileHash: Uint8Array;
}
declare const FileDemandBroadcast: MessageFns<FileDemandBroadcast>;
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

export { type DeepPartial, Envelope, ErrorReply, type Exact, FeePoolBaseTx, FeePoolClose, FeePoolCreate, FeePoolSign, FeePoolStatusQuery, FeePoolStatusResponse, FeePoolUpdate, FeePoolUpdateNotify, FileDemandBroadcast, FileDemandRequest, Header, type MessageFns, MsgKind, WSSignaling, deterministicMarshal, msgKindFromJSON, msgKindToJSON, protobufPackage, signEnvelope, verifyEnvelope };
