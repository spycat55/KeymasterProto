"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Envelope: () => Envelope,
  ErrorReply: () => ErrorReply,
  FeePoolBaseTx: () => FeePoolBaseTx,
  FeePoolClose: () => FeePoolClose,
  FeePoolCreate: () => FeePoolCreate,
  FeePoolListItem: () => FeePoolListItem,
  FeePoolListQuery: () => FeePoolListQuery,
  FeePoolListResponse: () => FeePoolListResponse,
  FeePoolSign: () => FeePoolSign,
  FeePoolStatusQuery: () => FeePoolStatusQuery,
  FeePoolStatusResponse: () => FeePoolStatusResponse,
  FeePoolUpdate: () => FeePoolUpdate,
  FeePoolUpdateNotify: () => FeePoolUpdateNotify,
  FileDemandBroadcast: () => FileDemandBroadcast,
  FileDemandRequest: () => FileDemandRequest,
  Header: () => Header,
  MsgKind: () => MsgKind,
  WSSignaling: () => WSSignaling,
  deterministicMarshal: () => deterministicMarshal,
  msgKindFromJSON: () => msgKindFromJSON,
  msgKindToJSON: () => msgKindToJSON,
  protobufPackage: () => protobufPackage,
  signEnvelope: () => signEnvelope,
  verifyEnvelope: () => verifyEnvelope
});
module.exports = __toCommonJS(index_exports);

// node_modules/@bufbuild/protobuf/dist/esm/wire/varint.js
function varint64read() {
  let lowBits = 0;
  let highBits = 0;
  for (let shift = 0; shift < 28; shift += 7) {
    let b = this.buf[this.pos++];
    lowBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  let middleByte = this.buf[this.pos++];
  lowBits |= (middleByte & 15) << 28;
  highBits = (middleByte & 112) >> 4;
  if ((middleByte & 128) == 0) {
    this.assertBounds();
    return [lowBits, highBits];
  }
  for (let shift = 3; shift <= 31; shift += 7) {
    let b = this.buf[this.pos++];
    highBits |= (b & 127) << shift;
    if ((b & 128) == 0) {
      this.assertBounds();
      return [lowBits, highBits];
    }
  }
  throw new Error("invalid varint");
}
function varint64write(lo, hi, bytes) {
  for (let i = 0; i < 28; i = i + 7) {
    const shift = lo >>> i;
    const hasNext = !(shift >>> 7 == 0 && hi == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  const splitBits = lo >>> 28 & 15 | (hi & 7) << 4;
  const hasMoreBits = !(hi >> 3 == 0);
  bytes.push((hasMoreBits ? splitBits | 128 : splitBits) & 255);
  if (!hasMoreBits) {
    return;
  }
  for (let i = 3; i < 31; i = i + 7) {
    const shift = hi >>> i;
    const hasNext = !(shift >>> 7 == 0);
    const byte = (hasNext ? shift | 128 : shift) & 255;
    bytes.push(byte);
    if (!hasNext) {
      return;
    }
  }
  bytes.push(hi >>> 31 & 1);
}
var TWO_PWR_32_DBL = 4294967296;
function int64FromString(dec) {
  const minus = dec[0] === "-";
  if (minus) {
    dec = dec.slice(1);
  }
  const base = 1e6;
  let lowBits = 0;
  let highBits = 0;
  function add1e6digit(begin, end) {
    const digit1e6 = Number(dec.slice(begin, end));
    highBits *= base;
    lowBits = lowBits * base + digit1e6;
    if (lowBits >= TWO_PWR_32_DBL) {
      highBits = highBits + (lowBits / TWO_PWR_32_DBL | 0);
      lowBits = lowBits % TWO_PWR_32_DBL;
    }
  }
  add1e6digit(-24, -18);
  add1e6digit(-18, -12);
  add1e6digit(-12, -6);
  add1e6digit(-6);
  return minus ? negate(lowBits, highBits) : newBits(lowBits, highBits);
}
function int64ToString(lo, hi) {
  let bits = newBits(lo, hi);
  const negative = bits.hi & 2147483648;
  if (negative) {
    bits = negate(bits.lo, bits.hi);
  }
  const result = uInt64ToString(bits.lo, bits.hi);
  return negative ? "-" + result : result;
}
function uInt64ToString(lo, hi) {
  ({ lo, hi } = toUnsigned(lo, hi));
  if (hi <= 2097151) {
    return String(TWO_PWR_32_DBL * hi + lo);
  }
  const low = lo & 16777215;
  const mid = (lo >>> 24 | hi << 8) & 16777215;
  const high = hi >> 16 & 65535;
  let digitA = low + mid * 6777216 + high * 6710656;
  let digitB = mid + high * 8147497;
  let digitC = high * 2;
  const base = 1e7;
  if (digitA >= base) {
    digitB += Math.floor(digitA / base);
    digitA %= base;
  }
  if (digitB >= base) {
    digitC += Math.floor(digitB / base);
    digitB %= base;
  }
  return digitC.toString() + decimalFrom1e7WithLeadingZeros(digitB) + decimalFrom1e7WithLeadingZeros(digitA);
}
function toUnsigned(lo, hi) {
  return { lo: lo >>> 0, hi: hi >>> 0 };
}
function newBits(lo, hi) {
  return { lo: lo | 0, hi: hi | 0 };
}
function negate(lowBits, highBits) {
  highBits = ~highBits;
  if (lowBits) {
    lowBits = ~lowBits + 1;
  } else {
    highBits += 1;
  }
  return newBits(lowBits, highBits);
}
var decimalFrom1e7WithLeadingZeros = (digit1e7) => {
  const partial = String(digit1e7);
  return "0000000".slice(partial.length) + partial;
};
function varint32write(value, bytes) {
  if (value >= 0) {
    while (value > 127) {
      bytes.push(value & 127 | 128);
      value = value >>> 7;
    }
    bytes.push(value);
  } else {
    for (let i = 0; i < 9; i++) {
      bytes.push(value & 127 | 128);
      value = value >> 7;
    }
    bytes.push(1);
  }
}
function varint32read() {
  let b = this.buf[this.pos++];
  let result = b & 127;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 7;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 14;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 127) << 21;
  if ((b & 128) == 0) {
    this.assertBounds();
    return result;
  }
  b = this.buf[this.pos++];
  result |= (b & 15) << 28;
  for (let readBytes = 5; (b & 128) !== 0 && readBytes < 10; readBytes++)
    b = this.buf[this.pos++];
  if ((b & 128) != 0)
    throw new Error("invalid varint");
  this.assertBounds();
  return result >>> 0;
}

// node_modules/@bufbuild/protobuf/dist/esm/proto-int64.js
var protoInt64 = /* @__PURE__ */ makeInt64Support();
function makeInt64Support() {
  const dv = new DataView(new ArrayBuffer(8));
  const ok = typeof BigInt === "function" && typeof dv.getBigInt64 === "function" && typeof dv.getBigUint64 === "function" && typeof dv.setBigInt64 === "function" && typeof dv.setBigUint64 === "function" && (typeof process != "object" || typeof process.env != "object" || process.env.BUF_BIGINT_DISABLE !== "1");
  if (ok) {
    const MIN = BigInt("-9223372036854775808");
    const MAX = BigInt("9223372036854775807");
    const UMIN = BigInt("0");
    const UMAX = BigInt("18446744073709551615");
    return {
      zero: BigInt(0),
      supported: true,
      parse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > MAX || bi < MIN) {
          throw new Error(`invalid int64: ${value}`);
        }
        return bi;
      },
      uParse(value) {
        const bi = typeof value == "bigint" ? value : BigInt(value);
        if (bi > UMAX || bi < UMIN) {
          throw new Error(`invalid uint64: ${value}`);
        }
        return bi;
      },
      enc(value) {
        dv.setBigInt64(0, this.parse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      uEnc(value) {
        dv.setBigInt64(0, this.uParse(value), true);
        return {
          lo: dv.getInt32(0, true),
          hi: dv.getInt32(4, true)
        };
      },
      dec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigInt64(0, true);
      },
      uDec(lo, hi) {
        dv.setInt32(0, lo, true);
        dv.setInt32(4, hi, true);
        return dv.getBigUint64(0, true);
      }
    };
  }
  return {
    zero: "0",
    supported: false,
    parse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return value;
    },
    uParse(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return value;
    },
    enc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertInt64String(value);
      return int64FromString(value);
    },
    uEnc(value) {
      if (typeof value != "string") {
        value = value.toString();
      }
      assertUInt64String(value);
      return int64FromString(value);
    },
    dec(lo, hi) {
      return int64ToString(lo, hi);
    },
    uDec(lo, hi) {
      return uInt64ToString(lo, hi);
    }
  };
}
function assertInt64String(value) {
  if (!/^-?[0-9]+$/.test(value)) {
    throw new Error("invalid int64: " + value);
  }
}
function assertUInt64String(value) {
  if (!/^[0-9]+$/.test(value)) {
    throw new Error("invalid uint64: " + value);
  }
}

// node_modules/@bufbuild/protobuf/dist/esm/wire/text-encoding.js
var symbol = Symbol.for("@bufbuild/protobuf/text-encoding");
function getTextEncoding() {
  if (globalThis[symbol] == void 0) {
    const te = new globalThis.TextEncoder();
    const td = new globalThis.TextDecoder();
    globalThis[symbol] = {
      encodeUtf8(text) {
        return te.encode(text);
      },
      decodeUtf8(bytes) {
        return td.decode(bytes);
      },
      checkUtf8(text) {
        try {
          encodeURIComponent(text);
          return true;
        } catch (_) {
          return false;
        }
      }
    };
  }
  return globalThis[symbol];
}

// node_modules/@bufbuild/protobuf/dist/esm/wire/binary-encoding.js
var WireType;
(function(WireType2) {
  WireType2[WireType2["Varint"] = 0] = "Varint";
  WireType2[WireType2["Bit64"] = 1] = "Bit64";
  WireType2[WireType2["LengthDelimited"] = 2] = "LengthDelimited";
  WireType2[WireType2["StartGroup"] = 3] = "StartGroup";
  WireType2[WireType2["EndGroup"] = 4] = "EndGroup";
  WireType2[WireType2["Bit32"] = 5] = "Bit32";
})(WireType || (WireType = {}));
var FLOAT32_MAX = 34028234663852886e22;
var FLOAT32_MIN = -34028234663852886e22;
var UINT32_MAX = 4294967295;
var INT32_MAX = 2147483647;
var INT32_MIN = -2147483648;
var BinaryWriter = class {
  constructor(encodeUtf8 = getTextEncoding().encodeUtf8) {
    this.encodeUtf8 = encodeUtf8;
    this.stack = [];
    this.chunks = [];
    this.buf = [];
  }
  /**
   * Return all bytes written and reset this writer.
   */
  finish() {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    let len = 0;
    for (let i = 0; i < this.chunks.length; i++)
      len += this.chunks[i].length;
    let bytes = new Uint8Array(len);
    let offset = 0;
    for (let i = 0; i < this.chunks.length; i++) {
      bytes.set(this.chunks[i], offset);
      offset += this.chunks[i].length;
    }
    this.chunks = [];
    return bytes;
  }
  /**
   * Start a new fork for length-delimited data like a message
   * or a packed repeated field.
   *
   * Must be joined later with `join()`.
   */
  fork() {
    this.stack.push({ chunks: this.chunks, buf: this.buf });
    this.chunks = [];
    this.buf = [];
    return this;
  }
  /**
   * Join the last fork. Write its length and bytes, then
   * return to the previous state.
   */
  join() {
    let chunk = this.finish();
    let prev = this.stack.pop();
    if (!prev)
      throw new Error("invalid state, fork stack empty");
    this.chunks = prev.chunks;
    this.buf = prev.buf;
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Writes a tag (field number and wire type).
   *
   * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`.
   *
   * Generated code should compute the tag ahead of time and call `uint32()`.
   */
  tag(fieldNo, type) {
    return this.uint32((fieldNo << 3 | type) >>> 0);
  }
  /**
   * Write a chunk of raw bytes.
   */
  raw(chunk) {
    if (this.buf.length) {
      this.chunks.push(new Uint8Array(this.buf));
      this.buf = [];
    }
    this.chunks.push(chunk);
    return this;
  }
  /**
   * Write a `uint32` value, an unsigned 32 bit varint.
   */
  uint32(value) {
    assertUInt32(value);
    while (value > 127) {
      this.buf.push(value & 127 | 128);
      value = value >>> 7;
    }
    this.buf.push(value);
    return this;
  }
  /**
   * Write a `int32` value, a signed 32 bit varint.
   */
  int32(value) {
    assertInt32(value);
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `bool` value, a variant.
   */
  bool(value) {
    this.buf.push(value ? 1 : 0);
    return this;
  }
  /**
   * Write a `bytes` value, length-delimited arbitrary data.
   */
  bytes(value) {
    this.uint32(value.byteLength);
    return this.raw(value);
  }
  /**
   * Write a `string` value, length-delimited data converted to UTF-8 text.
   */
  string(value) {
    let chunk = this.encodeUtf8(value);
    this.uint32(chunk.byteLength);
    return this.raw(chunk);
  }
  /**
   * Write a `float` value, 32-bit floating point number.
   */
  float(value) {
    assertFloat32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setFloat32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `double` value, a 64-bit floating point number.
   */
  double(value) {
    let chunk = new Uint8Array(8);
    new DataView(chunk.buffer).setFloat64(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
   */
  fixed32(value) {
    assertUInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setUint32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
   */
  sfixed32(value) {
    assertInt32(value);
    let chunk = new Uint8Array(4);
    new DataView(chunk.buffer).setInt32(0, value, true);
    return this.raw(chunk);
  }
  /**
   * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
   */
  sint32(value) {
    assertInt32(value);
    value = (value << 1 ^ value >> 31) >>> 0;
    varint32write(value, this.buf);
    return this;
  }
  /**
   * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
   */
  sfixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.enc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
   */
  fixed64(value) {
    let chunk = new Uint8Array(8), view = new DataView(chunk.buffer), tc = protoInt64.uEnc(value);
    view.setInt32(0, tc.lo, true);
    view.setInt32(4, tc.hi, true);
    return this.raw(chunk);
  }
  /**
   * Write a `int64` value, a signed 64-bit varint.
   */
  int64(value) {
    let tc = protoInt64.enc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
  /**
   * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64(value) {
    const tc = protoInt64.enc(value), sign = tc.hi >> 31, lo = tc.lo << 1 ^ sign, hi = (tc.hi << 1 | tc.lo >>> 31) ^ sign;
    varint64write(lo, hi, this.buf);
    return this;
  }
  /**
   * Write a `uint64` value, an unsigned 64-bit varint.
   */
  uint64(value) {
    const tc = protoInt64.uEnc(value);
    varint64write(tc.lo, tc.hi, this.buf);
    return this;
  }
};
var BinaryReader = class {
  constructor(buf, decodeUtf8 = getTextEncoding().decodeUtf8) {
    this.decodeUtf8 = decodeUtf8;
    this.varint64 = varint64read;
    this.uint32 = varint32read;
    this.buf = buf;
    this.len = buf.length;
    this.pos = 0;
    this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  }
  /**
   * Reads a tag - field number and wire type.
   */
  tag() {
    let tag = this.uint32(), fieldNo = tag >>> 3, wireType = tag & 7;
    if (fieldNo <= 0 || wireType < 0 || wireType > 5)
      throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
    return [fieldNo, wireType];
  }
  /**
   * Skip one element and return the skipped data.
   *
   * When skipping StartGroup, provide the tags field number to check for
   * matching field number in the EndGroup tag.
   */
  skip(wireType, fieldNo) {
    let start = this.pos;
    switch (wireType) {
      case WireType.Varint:
        while (this.buf[this.pos++] & 128) {
        }
        break;
      // @ts-expect-error TS7029: Fallthrough case in switch
      case WireType.Bit64:
        this.pos += 4;
      case WireType.Bit32:
        this.pos += 4;
        break;
      case WireType.LengthDelimited:
        let len = this.uint32();
        this.pos += len;
        break;
      case WireType.StartGroup:
        for (; ; ) {
          const [fn, wt] = this.tag();
          if (wt === WireType.EndGroup) {
            if (fieldNo !== void 0 && fn !== fieldNo) {
              throw new Error("invalid end group tag");
            }
            break;
          }
          this.skip(wt, fn);
        }
        break;
      default:
        throw new Error("cant skip wire type " + wireType);
    }
    this.assertBounds();
    return this.buf.subarray(start, this.pos);
  }
  /**
   * Throws error if position in byte array is out of range.
   */
  assertBounds() {
    if (this.pos > this.len)
      throw new RangeError("premature EOF");
  }
  /**
   * Read a `int32` field, a signed 32 bit varint.
   */
  int32() {
    return this.uint32() | 0;
  }
  /**
   * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
   */
  sint32() {
    let zze = this.uint32();
    return zze >>> 1 ^ -(zze & 1);
  }
  /**
   * Read a `int64` field, a signed 64-bit varint.
   */
  int64() {
    return protoInt64.dec(...this.varint64());
  }
  /**
   * Read a `uint64` field, an unsigned 64-bit varint.
   */
  uint64() {
    return protoInt64.uDec(...this.varint64());
  }
  /**
   * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
   */
  sint64() {
    let [lo, hi] = this.varint64();
    let s = -(lo & 1);
    lo = (lo >>> 1 | (hi & 1) << 31) ^ s;
    hi = hi >>> 1 ^ s;
    return protoInt64.dec(lo, hi);
  }
  /**
   * Read a `bool` field, a variant.
   */
  bool() {
    let [lo, hi] = this.varint64();
    return lo !== 0 || hi !== 0;
  }
  /**
   * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
   */
  fixed32() {
    return this.view.getUint32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
   */
  sfixed32() {
    return this.view.getInt32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
   */
  fixed64() {
    return protoInt64.uDec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
   */
  sfixed64() {
    return protoInt64.dec(this.sfixed32(), this.sfixed32());
  }
  /**
   * Read a `float` field, 32-bit floating point number.
   */
  float() {
    return this.view.getFloat32((this.pos += 4) - 4, true);
  }
  /**
   * Read a `double` field, a 64-bit floating point number.
   */
  double() {
    return this.view.getFloat64((this.pos += 8) - 8, true);
  }
  /**
   * Read a `bytes` field, length-delimited arbitrary data.
   */
  bytes() {
    let len = this.uint32(), start = this.pos;
    this.pos += len;
    this.assertBounds();
    return this.buf.subarray(start, start + len);
  }
  /**
   * Read a `string` field, length-delimited data converted to UTF-8 text.
   */
  string() {
    return this.decodeUtf8(this.bytes());
  }
};
function assertInt32(arg) {
  if (typeof arg == "string") {
    arg = Number(arg);
  } else if (typeof arg != "number") {
    throw new Error("invalid int32: " + typeof arg);
  }
  if (!Number.isInteger(arg) || arg > INT32_MAX || arg < INT32_MIN)
    throw new Error("invalid int32: " + arg);
}
function assertUInt32(arg) {
  if (typeof arg == "string") {
    arg = Number(arg);
  } else if (typeof arg != "number") {
    throw new Error("invalid uint32: " + typeof arg);
  }
  if (!Number.isInteger(arg) || arg > UINT32_MAX || arg < 0)
    throw new Error("invalid uint32: " + arg);
}
function assertFloat32(arg) {
  if (typeof arg == "string") {
    const o = arg;
    arg = Number(arg);
    if (Number.isNaN(arg) && o !== "NaN") {
      throw new Error("invalid float32: " + o);
    }
  } else if (typeof arg != "number") {
    throw new Error("invalid float32: " + typeof arg);
  }
  if (Number.isFinite(arg) && (arg > FLOAT32_MAX || arg < FLOAT32_MIN))
    throw new Error("invalid float32: " + arg);
}

// gen/ts/google/protobuf/timestamp.ts
function createBaseTimestamp() {
  return { seconds: 0, nanos: 0 };
}
var Timestamp = {
  encode(message, writer = new BinaryWriter()) {
    if (message.seconds !== 0) {
      writer.uint32(8).int64(message.seconds);
    }
    if (message.nanos !== 0) {
      writer.uint32(16).int32(message.nanos);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseTimestamp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.seconds = longToNumber(reader.int64());
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.nanos = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      seconds: isSet(object.seconds) ? globalThis.Number(object.seconds) : 0,
      nanos: isSet(object.nanos) ? globalThis.Number(object.nanos) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.seconds !== 0) {
      obj.seconds = Math.round(message.seconds);
    }
    if (message.nanos !== 0) {
      obj.nanos = Math.round(message.nanos);
    }
    return obj;
  },
  create(base) {
    return Timestamp.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseTimestamp();
    message.seconds = object.seconds ?? 0;
    message.nanos = object.nanos ?? 0;
    return message;
  }
};
function longToNumber(int64) {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}
function isSet(value) {
  return value !== null && value !== void 0;
}

// gen/ts/message.ts
var protobufPackage = "api.webrtc.v1";
var MsgKind = /* @__PURE__ */ ((MsgKind2) => {
  MsgKind2[MsgKind2["KIND_UNSPECIFIED"] = 0] = "KIND_UNSPECIFIED";
  MsgKind2[MsgKind2["KIND_ERROR"] = 1] = "KIND_ERROR";
  MsgKind2[MsgKind2["KIND_WS_SIGNALING"] = 2] = "KIND_WS_SIGNALING";
  MsgKind2[MsgKind2["KIND_FILE_DEMAND_REQUEST"] = 10] = "KIND_FILE_DEMAND_REQUEST";
  MsgKind2[MsgKind2["KIND_FILE_DEMAND_BROADCAST"] = 11] = "KIND_FILE_DEMAND_BROADCAST";
  MsgKind2[MsgKind2["KIND_FEE_POOL_CREATE"] = 12] = "KIND_FEE_POOL_CREATE";
  MsgKind2[MsgKind2["KIND_FEE_POOL_SIGN"] = 13] = "KIND_FEE_POOL_SIGN";
  MsgKind2[MsgKind2["KIND_FEE_POOL_BASE_TX"] = 14] = "KIND_FEE_POOL_BASE_TX";
  MsgKind2[MsgKind2["KIND_FEE_POOL_UPDATE"] = 15] = "KIND_FEE_POOL_UPDATE";
  MsgKind2[MsgKind2["KIND_FEE_POOL_UPDATE_NOTIFY"] = 16] = "KIND_FEE_POOL_UPDATE_NOTIFY";
  MsgKind2[MsgKind2["KIND_FEE_POOL_CLOSE"] = 17] = "KIND_FEE_POOL_CLOSE";
  MsgKind2[MsgKind2["KIND_FEE_POOL_STATUS_QUERY"] = 18] = "KIND_FEE_POOL_STATUS_QUERY";
  MsgKind2[MsgKind2["KIND_FEE_POOL_STATUS_RESPONSE"] = 19] = "KIND_FEE_POOL_STATUS_RESPONSE";
  MsgKind2[MsgKind2["KIND_FEE_POOL_LIST_QUERY"] = 20] = "KIND_FEE_POOL_LIST_QUERY";
  MsgKind2[MsgKind2["KIND_FEE_POOL_LIST_RESPONSE"] = 21] = "KIND_FEE_POOL_LIST_RESPONSE";
  MsgKind2[MsgKind2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
  return MsgKind2;
})(MsgKind || {});
function msgKindFromJSON(object) {
  switch (object) {
    case 0:
    case "KIND_UNSPECIFIED":
      return 0 /* KIND_UNSPECIFIED */;
    case 1:
    case "KIND_ERROR":
      return 1 /* KIND_ERROR */;
    case 2:
    case "KIND_WS_SIGNALING":
      return 2 /* KIND_WS_SIGNALING */;
    case 10:
    case "KIND_FILE_DEMAND_REQUEST":
      return 10 /* KIND_FILE_DEMAND_REQUEST */;
    case 11:
    case "KIND_FILE_DEMAND_BROADCAST":
      return 11 /* KIND_FILE_DEMAND_BROADCAST */;
    case 12:
    case "KIND_FEE_POOL_CREATE":
      return 12 /* KIND_FEE_POOL_CREATE */;
    case 13:
    case "KIND_FEE_POOL_SIGN":
      return 13 /* KIND_FEE_POOL_SIGN */;
    case 14:
    case "KIND_FEE_POOL_BASE_TX":
      return 14 /* KIND_FEE_POOL_BASE_TX */;
    case 15:
    case "KIND_FEE_POOL_UPDATE":
      return 15 /* KIND_FEE_POOL_UPDATE */;
    case 16:
    case "KIND_FEE_POOL_UPDATE_NOTIFY":
      return 16 /* KIND_FEE_POOL_UPDATE_NOTIFY */;
    case 17:
    case "KIND_FEE_POOL_CLOSE":
      return 17 /* KIND_FEE_POOL_CLOSE */;
    case 18:
    case "KIND_FEE_POOL_STATUS_QUERY":
      return 18 /* KIND_FEE_POOL_STATUS_QUERY */;
    case 19:
    case "KIND_FEE_POOL_STATUS_RESPONSE":
      return 19 /* KIND_FEE_POOL_STATUS_RESPONSE */;
    case 20:
    case "KIND_FEE_POOL_LIST_QUERY":
      return 20 /* KIND_FEE_POOL_LIST_QUERY */;
    case 21:
    case "KIND_FEE_POOL_LIST_RESPONSE":
      return 21 /* KIND_FEE_POOL_LIST_RESPONSE */;
    case -1:
    case "UNRECOGNIZED":
    default:
      return -1 /* UNRECOGNIZED */;
  }
}
function msgKindToJSON(object) {
  switch (object) {
    case 0 /* KIND_UNSPECIFIED */:
      return "KIND_UNSPECIFIED";
    case 1 /* KIND_ERROR */:
      return "KIND_ERROR";
    case 2 /* KIND_WS_SIGNALING */:
      return "KIND_WS_SIGNALING";
    case 10 /* KIND_FILE_DEMAND_REQUEST */:
      return "KIND_FILE_DEMAND_REQUEST";
    case 11 /* KIND_FILE_DEMAND_BROADCAST */:
      return "KIND_FILE_DEMAND_BROADCAST";
    case 12 /* KIND_FEE_POOL_CREATE */:
      return "KIND_FEE_POOL_CREATE";
    case 13 /* KIND_FEE_POOL_SIGN */:
      return "KIND_FEE_POOL_SIGN";
    case 14 /* KIND_FEE_POOL_BASE_TX */:
      return "KIND_FEE_POOL_BASE_TX";
    case 15 /* KIND_FEE_POOL_UPDATE */:
      return "KIND_FEE_POOL_UPDATE";
    case 16 /* KIND_FEE_POOL_UPDATE_NOTIFY */:
      return "KIND_FEE_POOL_UPDATE_NOTIFY";
    case 17 /* KIND_FEE_POOL_CLOSE */:
      return "KIND_FEE_POOL_CLOSE";
    case 18 /* KIND_FEE_POOL_STATUS_QUERY */:
      return "KIND_FEE_POOL_STATUS_QUERY";
    case 19 /* KIND_FEE_POOL_STATUS_RESPONSE */:
      return "KIND_FEE_POOL_STATUS_RESPONSE";
    case 20 /* KIND_FEE_POOL_LIST_QUERY */:
      return "KIND_FEE_POOL_LIST_QUERY";
    case 21 /* KIND_FEE_POOL_LIST_RESPONSE */:
      return "KIND_FEE_POOL_LIST_RESPONSE";
    case -1 /* UNRECOGNIZED */:
    default:
      return "UNRECOGNIZED";
  }
}
function createBaseHeader() {
  return {
    kind: 0,
    messageId: "",
    correlationId: "",
    ts: void 0,
    fromPubkey: new Uint8Array(0),
    toPubkey: new Uint8Array(0)
  };
}
var Header = {
  encode(message, writer = new BinaryWriter()) {
    if (message.kind !== 0) {
      writer.uint32(8).int32(message.kind);
    }
    if (message.messageId !== "") {
      writer.uint32(18).string(message.messageId);
    }
    if (message.correlationId !== "") {
      writer.uint32(26).string(message.correlationId);
    }
    if (message.ts !== void 0) {
      Timestamp.encode(toTimestamp(message.ts), writer.uint32(34).fork()).join();
    }
    if (message.fromPubkey.length !== 0) {
      writer.uint32(42).bytes(message.fromPubkey);
    }
    if (message.toPubkey.length !== 0) {
      writer.uint32(50).bytes(message.toPubkey);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseHeader();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.kind = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.messageId = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.correlationId = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }
          message.ts = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }
          message.fromPubkey = reader.bytes();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }
          message.toPubkey = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      kind: isSet2(object.kind) ? msgKindFromJSON(object.kind) : 0,
      messageId: isSet2(object.messageId) ? globalThis.String(object.messageId) : "",
      correlationId: isSet2(object.correlationId) ? globalThis.String(object.correlationId) : "",
      ts: isSet2(object.ts) ? fromJsonTimestamp(object.ts) : void 0,
      fromPubkey: isSet2(object.fromPubkey) ? bytesFromBase64(object.fromPubkey) : new Uint8Array(0),
      toPubkey: isSet2(object.toPubkey) ? bytesFromBase64(object.toPubkey) : new Uint8Array(0)
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.kind !== 0) {
      obj.kind = msgKindToJSON(message.kind);
    }
    if (message.messageId !== "") {
      obj.messageId = message.messageId;
    }
    if (message.correlationId !== "") {
      obj.correlationId = message.correlationId;
    }
    if (message.ts !== void 0) {
      obj.ts = message.ts.toISOString();
    }
    if (message.fromPubkey.length !== 0) {
      obj.fromPubkey = base64FromBytes(message.fromPubkey);
    }
    if (message.toPubkey.length !== 0) {
      obj.toPubkey = base64FromBytes(message.toPubkey);
    }
    return obj;
  },
  create(base) {
    return Header.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseHeader();
    message.kind = object.kind ?? 0;
    message.messageId = object.messageId ?? "";
    message.correlationId = object.correlationId ?? "";
    message.ts = object.ts ?? void 0;
    message.fromPubkey = object.fromPubkey ?? new Uint8Array(0);
    message.toPubkey = object.toPubkey ?? new Uint8Array(0);
    return message;
  }
};
function createBaseEnvelope() {
  return {
    version: 0,
    header: void 0,
    signature: new Uint8Array(0),
    signatureAlgo: "",
    errorReply: void 0,
    wsSignaling: void 0,
    fileDemandRequest: void 0,
    fileDemandBroadcast: void 0,
    feePoolCreate: void 0,
    feePoolSign: void 0,
    feePoolBaseTx: void 0,
    feePoolUpdate: void 0,
    feePoolUpdateNotify: void 0,
    feePoolClose: void 0,
    feePoolStatusQuery: void 0,
    feePoolStatusResponse: void 0,
    feePoolListQuery: void 0,
    feePoolListResponse: void 0
  };
}
var Envelope = {
  encode(message, writer = new BinaryWriter()) {
    if (message.version !== 0) {
      writer.uint32(8).uint32(message.version);
    }
    if (message.header !== void 0) {
      Header.encode(message.header, writer.uint32(18).fork()).join();
    }
    if (message.signature.length !== 0) {
      writer.uint32(26).bytes(message.signature);
    }
    if (message.signatureAlgo !== "") {
      writer.uint32(34).string(message.signatureAlgo);
    }
    if (message.errorReply !== void 0) {
      ErrorReply.encode(message.errorReply, writer.uint32(42).fork()).join();
    }
    if (message.wsSignaling !== void 0) {
      WSSignaling.encode(message.wsSignaling, writer.uint32(50).fork()).join();
    }
    if (message.fileDemandRequest !== void 0) {
      FileDemandRequest.encode(message.fileDemandRequest, writer.uint32(82).fork()).join();
    }
    if (message.fileDemandBroadcast !== void 0) {
      FileDemandBroadcast.encode(message.fileDemandBroadcast, writer.uint32(90).fork()).join();
    }
    if (message.feePoolCreate !== void 0) {
      FeePoolCreate.encode(message.feePoolCreate, writer.uint32(98).fork()).join();
    }
    if (message.feePoolSign !== void 0) {
      FeePoolSign.encode(message.feePoolSign, writer.uint32(106).fork()).join();
    }
    if (message.feePoolBaseTx !== void 0) {
      FeePoolBaseTx.encode(message.feePoolBaseTx, writer.uint32(114).fork()).join();
    }
    if (message.feePoolUpdate !== void 0) {
      FeePoolUpdate.encode(message.feePoolUpdate, writer.uint32(122).fork()).join();
    }
    if (message.feePoolUpdateNotify !== void 0) {
      FeePoolUpdateNotify.encode(message.feePoolUpdateNotify, writer.uint32(130).fork()).join();
    }
    if (message.feePoolClose !== void 0) {
      FeePoolClose.encode(message.feePoolClose, writer.uint32(138).fork()).join();
    }
    if (message.feePoolStatusQuery !== void 0) {
      FeePoolStatusQuery.encode(message.feePoolStatusQuery, writer.uint32(146).fork()).join();
    }
    if (message.feePoolStatusResponse !== void 0) {
      FeePoolStatusResponse.encode(message.feePoolStatusResponse, writer.uint32(154).fork()).join();
    }
    if (message.feePoolListQuery !== void 0) {
      FeePoolListQuery.encode(message.feePoolListQuery, writer.uint32(162).fork()).join();
    }
    if (message.feePoolListResponse !== void 0) {
      FeePoolListResponse.encode(message.feePoolListResponse, writer.uint32(170).fork()).join();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseEnvelope();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.version = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.header = Header.decode(reader, reader.uint32());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.signature = reader.bytes();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }
          message.signatureAlgo = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }
          message.errorReply = ErrorReply.decode(reader, reader.uint32());
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }
          message.wsSignaling = WSSignaling.decode(reader, reader.uint32());
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }
          message.fileDemandRequest = FileDemandRequest.decode(reader, reader.uint32());
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }
          message.fileDemandBroadcast = FileDemandBroadcast.decode(reader, reader.uint32());
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }
          message.feePoolCreate = FeePoolCreate.decode(reader, reader.uint32());
          continue;
        }
        case 13: {
          if (tag !== 106) {
            break;
          }
          message.feePoolSign = FeePoolSign.decode(reader, reader.uint32());
          continue;
        }
        case 14: {
          if (tag !== 114) {
            break;
          }
          message.feePoolBaseTx = FeePoolBaseTx.decode(reader, reader.uint32());
          continue;
        }
        case 15: {
          if (tag !== 122) {
            break;
          }
          message.feePoolUpdate = FeePoolUpdate.decode(reader, reader.uint32());
          continue;
        }
        case 16: {
          if (tag !== 130) {
            break;
          }
          message.feePoolUpdateNotify = FeePoolUpdateNotify.decode(reader, reader.uint32());
          continue;
        }
        case 17: {
          if (tag !== 138) {
            break;
          }
          message.feePoolClose = FeePoolClose.decode(reader, reader.uint32());
          continue;
        }
        case 18: {
          if (tag !== 146) {
            break;
          }
          message.feePoolStatusQuery = FeePoolStatusQuery.decode(reader, reader.uint32());
          continue;
        }
        case 19: {
          if (tag !== 154) {
            break;
          }
          message.feePoolStatusResponse = FeePoolStatusResponse.decode(reader, reader.uint32());
          continue;
        }
        case 20: {
          if (tag !== 162) {
            break;
          }
          message.feePoolListQuery = FeePoolListQuery.decode(reader, reader.uint32());
          continue;
        }
        case 21: {
          if (tag !== 170) {
            break;
          }
          message.feePoolListResponse = FeePoolListResponse.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      version: isSet2(object.version) ? globalThis.Number(object.version) : 0,
      header: isSet2(object.header) ? Header.fromJSON(object.header) : void 0,
      signature: isSet2(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(0),
      signatureAlgo: isSet2(object.signatureAlgo) ? globalThis.String(object.signatureAlgo) : "",
      errorReply: isSet2(object.errorReply) ? ErrorReply.fromJSON(object.errorReply) : void 0,
      wsSignaling: isSet2(object.wsSignaling) ? WSSignaling.fromJSON(object.wsSignaling) : void 0,
      fileDemandRequest: isSet2(object.fileDemandRequest) ? FileDemandRequest.fromJSON(object.fileDemandRequest) : void 0,
      fileDemandBroadcast: isSet2(object.fileDemandBroadcast) ? FileDemandBroadcast.fromJSON(object.fileDemandBroadcast) : void 0,
      feePoolCreate: isSet2(object.feePoolCreate) ? FeePoolCreate.fromJSON(object.feePoolCreate) : void 0,
      feePoolSign: isSet2(object.feePoolSign) ? FeePoolSign.fromJSON(object.feePoolSign) : void 0,
      feePoolBaseTx: isSet2(object.feePoolBaseTx) ? FeePoolBaseTx.fromJSON(object.feePoolBaseTx) : void 0,
      feePoolUpdate: isSet2(object.feePoolUpdate) ? FeePoolUpdate.fromJSON(object.feePoolUpdate) : void 0,
      feePoolUpdateNotify: isSet2(object.feePoolUpdateNotify) ? FeePoolUpdateNotify.fromJSON(object.feePoolUpdateNotify) : void 0,
      feePoolClose: isSet2(object.feePoolClose) ? FeePoolClose.fromJSON(object.feePoolClose) : void 0,
      feePoolStatusQuery: isSet2(object.feePoolStatusQuery) ? FeePoolStatusQuery.fromJSON(object.feePoolStatusQuery) : void 0,
      feePoolStatusResponse: isSet2(object.feePoolStatusResponse) ? FeePoolStatusResponse.fromJSON(object.feePoolStatusResponse) : void 0,
      feePoolListQuery: isSet2(object.feePoolListQuery) ? FeePoolListQuery.fromJSON(object.feePoolListQuery) : void 0,
      feePoolListResponse: isSet2(object.feePoolListResponse) ? FeePoolListResponse.fromJSON(object.feePoolListResponse) : void 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    if (message.header !== void 0) {
      obj.header = Header.toJSON(message.header);
    }
    if (message.signature.length !== 0) {
      obj.signature = base64FromBytes(message.signature);
    }
    if (message.signatureAlgo !== "") {
      obj.signatureAlgo = message.signatureAlgo;
    }
    if (message.errorReply !== void 0) {
      obj.errorReply = ErrorReply.toJSON(message.errorReply);
    }
    if (message.wsSignaling !== void 0) {
      obj.wsSignaling = WSSignaling.toJSON(message.wsSignaling);
    }
    if (message.fileDemandRequest !== void 0) {
      obj.fileDemandRequest = FileDemandRequest.toJSON(message.fileDemandRequest);
    }
    if (message.fileDemandBroadcast !== void 0) {
      obj.fileDemandBroadcast = FileDemandBroadcast.toJSON(message.fileDemandBroadcast);
    }
    if (message.feePoolCreate !== void 0) {
      obj.feePoolCreate = FeePoolCreate.toJSON(message.feePoolCreate);
    }
    if (message.feePoolSign !== void 0) {
      obj.feePoolSign = FeePoolSign.toJSON(message.feePoolSign);
    }
    if (message.feePoolBaseTx !== void 0) {
      obj.feePoolBaseTx = FeePoolBaseTx.toJSON(message.feePoolBaseTx);
    }
    if (message.feePoolUpdate !== void 0) {
      obj.feePoolUpdate = FeePoolUpdate.toJSON(message.feePoolUpdate);
    }
    if (message.feePoolUpdateNotify !== void 0) {
      obj.feePoolUpdateNotify = FeePoolUpdateNotify.toJSON(message.feePoolUpdateNotify);
    }
    if (message.feePoolClose !== void 0) {
      obj.feePoolClose = FeePoolClose.toJSON(message.feePoolClose);
    }
    if (message.feePoolStatusQuery !== void 0) {
      obj.feePoolStatusQuery = FeePoolStatusQuery.toJSON(message.feePoolStatusQuery);
    }
    if (message.feePoolStatusResponse !== void 0) {
      obj.feePoolStatusResponse = FeePoolStatusResponse.toJSON(message.feePoolStatusResponse);
    }
    if (message.feePoolListQuery !== void 0) {
      obj.feePoolListQuery = FeePoolListQuery.toJSON(message.feePoolListQuery);
    }
    if (message.feePoolListResponse !== void 0) {
      obj.feePoolListResponse = FeePoolListResponse.toJSON(message.feePoolListResponse);
    }
    return obj;
  },
  create(base) {
    return Envelope.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseEnvelope();
    message.version = object.version ?? 0;
    message.header = object.header !== void 0 && object.header !== null ? Header.fromPartial(object.header) : void 0;
    message.signature = object.signature ?? new Uint8Array(0);
    message.signatureAlgo = object.signatureAlgo ?? "";
    message.errorReply = object.errorReply !== void 0 && object.errorReply !== null ? ErrorReply.fromPartial(object.errorReply) : void 0;
    message.wsSignaling = object.wsSignaling !== void 0 && object.wsSignaling !== null ? WSSignaling.fromPartial(object.wsSignaling) : void 0;
    message.fileDemandRequest = object.fileDemandRequest !== void 0 && object.fileDemandRequest !== null ? FileDemandRequest.fromPartial(object.fileDemandRequest) : void 0;
    message.fileDemandBroadcast = object.fileDemandBroadcast !== void 0 && object.fileDemandBroadcast !== null ? FileDemandBroadcast.fromPartial(object.fileDemandBroadcast) : void 0;
    message.feePoolCreate = object.feePoolCreate !== void 0 && object.feePoolCreate !== null ? FeePoolCreate.fromPartial(object.feePoolCreate) : void 0;
    message.feePoolSign = object.feePoolSign !== void 0 && object.feePoolSign !== null ? FeePoolSign.fromPartial(object.feePoolSign) : void 0;
    message.feePoolBaseTx = object.feePoolBaseTx !== void 0 && object.feePoolBaseTx !== null ? FeePoolBaseTx.fromPartial(object.feePoolBaseTx) : void 0;
    message.feePoolUpdate = object.feePoolUpdate !== void 0 && object.feePoolUpdate !== null ? FeePoolUpdate.fromPartial(object.feePoolUpdate) : void 0;
    message.feePoolUpdateNotify = object.feePoolUpdateNotify !== void 0 && object.feePoolUpdateNotify !== null ? FeePoolUpdateNotify.fromPartial(object.feePoolUpdateNotify) : void 0;
    message.feePoolClose = object.feePoolClose !== void 0 && object.feePoolClose !== null ? FeePoolClose.fromPartial(object.feePoolClose) : void 0;
    message.feePoolStatusQuery = object.feePoolStatusQuery !== void 0 && object.feePoolStatusQuery !== null ? FeePoolStatusQuery.fromPartial(object.feePoolStatusQuery) : void 0;
    message.feePoolStatusResponse = object.feePoolStatusResponse !== void 0 && object.feePoolStatusResponse !== null ? FeePoolStatusResponse.fromPartial(object.feePoolStatusResponse) : void 0;
    message.feePoolListQuery = object.feePoolListQuery !== void 0 && object.feePoolListQuery !== null ? FeePoolListQuery.fromPartial(object.feePoolListQuery) : void 0;
    message.feePoolListResponse = object.feePoolListResponse !== void 0 && object.feePoolListResponse !== null ? FeePoolListResponse.fromPartial(object.feePoolListResponse) : void 0;
    return message;
  }
};
function createBaseErrorReply() {
  return { errorCode: "", detail: "" };
}
var ErrorReply = {
  encode(message, writer = new BinaryWriter()) {
    if (message.errorCode !== "") {
      writer.uint32(10).string(message.errorCode);
    }
    if (message.detail !== "") {
      writer.uint32(18).string(message.detail);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseErrorReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.errorCode = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.detail = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      errorCode: isSet2(object.errorCode) ? globalThis.String(object.errorCode) : "",
      detail: isSet2(object.detail) ? globalThis.String(object.detail) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.errorCode !== "") {
      obj.errorCode = message.errorCode;
    }
    if (message.detail !== "") {
      obj.detail = message.detail;
    }
    return obj;
  },
  create(base) {
    return ErrorReply.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseErrorReply();
    message.errorCode = object.errorCode ?? "";
    message.detail = object.detail ?? "";
    return message;
  }
};
function createBaseWSSignaling() {
  return { signalingType: "", data: new Uint8Array(0) };
}
var WSSignaling = {
  encode(message, writer = new BinaryWriter()) {
    if (message.signalingType !== "") {
      writer.uint32(10).string(message.signalingType);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseWSSignaling();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.signalingType = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.data = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      signalingType: isSet2(object.signalingType) ? globalThis.String(object.signalingType) : "",
      data: isSet2(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0)
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.signalingType !== "") {
      obj.signalingType = message.signalingType;
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },
  create(base) {
    return WSSignaling.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseWSSignaling();
    message.signalingType = object.signalingType ?? "";
    message.data = object.data ?? new Uint8Array(0);
    return message;
  }
};
function createBaseFeePoolCreate() {
  return { spendTx: new Uint8Array(0), inputAmount: 0, clientSignature: new Uint8Array(0) };
}
var FeePoolCreate = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTx.length !== 0) {
      writer.uint32(10).bytes(message.spendTx);
    }
    if (message.inputAmount !== 0) {
      writer.uint32(16).uint64(message.inputAmount);
    }
    if (message.clientSignature.length !== 0) {
      writer.uint32(26).bytes(message.clientSignature);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolCreate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTx = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.inputAmount = longToNumber2(reader.uint64());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.clientSignature = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTx: isSet2(object.spendTx) ? bytesFromBase64(object.spendTx) : new Uint8Array(0),
      inputAmount: isSet2(object.inputAmount) ? globalThis.Number(object.inputAmount) : 0,
      clientSignature: isSet2(object.clientSignature) ? bytesFromBase64(object.clientSignature) : new Uint8Array(0)
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTx.length !== 0) {
      obj.spendTx = base64FromBytes(message.spendTx);
    }
    if (message.inputAmount !== 0) {
      obj.inputAmount = Math.round(message.inputAmount);
    }
    if (message.clientSignature.length !== 0) {
      obj.clientSignature = base64FromBytes(message.clientSignature);
    }
    return obj;
  },
  create(base) {
    return FeePoolCreate.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolCreate();
    message.spendTx = object.spendTx ?? new Uint8Array(0);
    message.inputAmount = object.inputAmount ?? 0;
    message.clientSignature = object.clientSignature ?? new Uint8Array(0);
    return message;
  }
};
function createBaseFeePoolSign() {
  return { spendTxid: new Uint8Array(0), serverSignature: new Uint8Array(0), errorMessage: "" };
}
var FeePoolSign = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxid.length !== 0) {
      writer.uint32(10).bytes(message.spendTxid);
    }
    if (message.serverSignature.length !== 0) {
      writer.uint32(18).bytes(message.serverSignature);
    }
    if (message.errorMessage !== "") {
      writer.uint32(26).string(message.errorMessage);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolSign();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxid = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.serverSignature = reader.bytes();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.errorMessage = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTxid: isSet2(object.spendTxid) ? bytesFromBase64(object.spendTxid) : new Uint8Array(0),
      serverSignature: isSet2(object.serverSignature) ? bytesFromBase64(object.serverSignature) : new Uint8Array(0),
      errorMessage: isSet2(object.errorMessage) ? globalThis.String(object.errorMessage) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxid.length !== 0) {
      obj.spendTxid = base64FromBytes(message.spendTxid);
    }
    if (message.serverSignature.length !== 0) {
      obj.serverSignature = base64FromBytes(message.serverSignature);
    }
    if (message.errorMessage !== "") {
      obj.errorMessage = message.errorMessage;
    }
    return obj;
  },
  create(base) {
    return FeePoolSign.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolSign();
    message.spendTxid = object.spendTxid ?? new Uint8Array(0);
    message.serverSignature = object.serverSignature ?? new Uint8Array(0);
    message.errorMessage = object.errorMessage ?? "";
    return message;
  }
};
function createBaseFeePoolBaseTx() {
  return { spendTxid: new Uint8Array(0), baseTx: new Uint8Array(0), clientSignature: new Uint8Array(0) };
}
var FeePoolBaseTx = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxid.length !== 0) {
      writer.uint32(10).bytes(message.spendTxid);
    }
    if (message.baseTx.length !== 0) {
      writer.uint32(18).bytes(message.baseTx);
    }
    if (message.clientSignature.length !== 0) {
      writer.uint32(26).bytes(message.clientSignature);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolBaseTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxid = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.baseTx = reader.bytes();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.clientSignature = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTxid: isSet2(object.spendTxid) ? bytesFromBase64(object.spendTxid) : new Uint8Array(0),
      baseTx: isSet2(object.baseTx) ? bytesFromBase64(object.baseTx) : new Uint8Array(0),
      clientSignature: isSet2(object.clientSignature) ? bytesFromBase64(object.clientSignature) : new Uint8Array(0)
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxid.length !== 0) {
      obj.spendTxid = base64FromBytes(message.spendTxid);
    }
    if (message.baseTx.length !== 0) {
      obj.baseTx = base64FromBytes(message.baseTx);
    }
    if (message.clientSignature.length !== 0) {
      obj.clientSignature = base64FromBytes(message.clientSignature);
    }
    return obj;
  },
  create(base) {
    return FeePoolBaseTx.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolBaseTx();
    message.spendTxid = object.spendTxid ?? new Uint8Array(0);
    message.baseTx = object.baseTx ?? new Uint8Array(0);
    message.clientSignature = object.clientSignature ?? new Uint8Array(0);
    return message;
  }
};
function createBaseFeePoolUpdateNotify() {
  return { spendTxid: new Uint8Array(0), sequenceNumber: 0, serverAmount: 0, fee: 0 };
}
var FeePoolUpdateNotify = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxid.length !== 0) {
      writer.uint32(10).bytes(message.spendTxid);
    }
    if (message.sequenceNumber !== 0) {
      writer.uint32(16).uint32(message.sequenceNumber);
    }
    if (message.serverAmount !== 0) {
      writer.uint32(24).uint64(message.serverAmount);
    }
    if (message.fee !== 0) {
      writer.uint32(32).uint64(message.fee);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolUpdateNotify();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxid = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.sequenceNumber = reader.uint32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }
          message.serverAmount = longToNumber2(reader.uint64());
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }
          message.fee = longToNumber2(reader.uint64());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTxid: isSet2(object.spendTxid) ? bytesFromBase64(object.spendTxid) : new Uint8Array(0),
      sequenceNumber: isSet2(object.sequenceNumber) ? globalThis.Number(object.sequenceNumber) : 0,
      serverAmount: isSet2(object.serverAmount) ? globalThis.Number(object.serverAmount) : 0,
      fee: isSet2(object.fee) ? globalThis.Number(object.fee) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxid.length !== 0) {
      obj.spendTxid = base64FromBytes(message.spendTxid);
    }
    if (message.sequenceNumber !== 0) {
      obj.sequenceNumber = Math.round(message.sequenceNumber);
    }
    if (message.serverAmount !== 0) {
      obj.serverAmount = Math.round(message.serverAmount);
    }
    if (message.fee !== 0) {
      obj.fee = Math.round(message.fee);
    }
    return obj;
  },
  create(base) {
    return FeePoolUpdateNotify.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolUpdateNotify();
    message.spendTxid = object.spendTxid ?? new Uint8Array(0);
    message.sequenceNumber = object.sequenceNumber ?? 0;
    message.serverAmount = object.serverAmount ?? 0;
    message.fee = object.fee ?? 0;
    return message;
  }
};
function createBaseFeePoolUpdate() {
  return { spendTxid: new Uint8Array(0), sequenceNumber: 0, serverAmount: 0, fee: 0, signature: new Uint8Array(0) };
}
var FeePoolUpdate = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxid.length !== 0) {
      writer.uint32(10).bytes(message.spendTxid);
    }
    if (message.sequenceNumber !== 0) {
      writer.uint32(16).uint32(message.sequenceNumber);
    }
    if (message.serverAmount !== 0) {
      writer.uint32(24).uint64(message.serverAmount);
    }
    if (message.fee !== 0) {
      writer.uint32(32).uint64(message.fee);
    }
    if (message.signature.length !== 0) {
      writer.uint32(42).bytes(message.signature);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxid = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.sequenceNumber = reader.uint32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }
          message.serverAmount = longToNumber2(reader.uint64());
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }
          message.fee = longToNumber2(reader.uint64());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }
          message.signature = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTxid: isSet2(object.spendTxid) ? bytesFromBase64(object.spendTxid) : new Uint8Array(0),
      sequenceNumber: isSet2(object.sequenceNumber) ? globalThis.Number(object.sequenceNumber) : 0,
      serverAmount: isSet2(object.serverAmount) ? globalThis.Number(object.serverAmount) : 0,
      fee: isSet2(object.fee) ? globalThis.Number(object.fee) : 0,
      signature: isSet2(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(0)
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxid.length !== 0) {
      obj.spendTxid = base64FromBytes(message.spendTxid);
    }
    if (message.sequenceNumber !== 0) {
      obj.sequenceNumber = Math.round(message.sequenceNumber);
    }
    if (message.serverAmount !== 0) {
      obj.serverAmount = Math.round(message.serverAmount);
    }
    if (message.fee !== 0) {
      obj.fee = Math.round(message.fee);
    }
    if (message.signature.length !== 0) {
      obj.signature = base64FromBytes(message.signature);
    }
    return obj;
  },
  create(base) {
    return FeePoolUpdate.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolUpdate();
    message.spendTxid = object.spendTxid ?? new Uint8Array(0);
    message.sequenceNumber = object.sequenceNumber ?? 0;
    message.serverAmount = object.serverAmount ?? 0;
    message.fee = object.fee ?? 0;
    message.signature = object.signature ?? new Uint8Array(0);
    return message;
  }
};
function createBaseFeePoolClose() {
  return { spendTxid: new Uint8Array(0), serverAmount: 0, fee: 0, signature: new Uint8Array(0) };
}
var FeePoolClose = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxid.length !== 0) {
      writer.uint32(10).bytes(message.spendTxid);
    }
    if (message.serverAmount !== 0) {
      writer.uint32(16).uint64(message.serverAmount);
    }
    if (message.fee !== 0) {
      writer.uint32(24).uint64(message.fee);
    }
    if (message.signature.length !== 0) {
      writer.uint32(34).bytes(message.signature);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolClose();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxid = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.serverAmount = longToNumber2(reader.uint64());
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }
          message.fee = longToNumber2(reader.uint64());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }
          message.signature = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTxid: isSet2(object.spendTxid) ? bytesFromBase64(object.spendTxid) : new Uint8Array(0),
      serverAmount: isSet2(object.serverAmount) ? globalThis.Number(object.serverAmount) : 0,
      fee: isSet2(object.fee) ? globalThis.Number(object.fee) : 0,
      signature: isSet2(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(0)
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxid.length !== 0) {
      obj.spendTxid = base64FromBytes(message.spendTxid);
    }
    if (message.serverAmount !== 0) {
      obj.serverAmount = Math.round(message.serverAmount);
    }
    if (message.fee !== 0) {
      obj.fee = Math.round(message.fee);
    }
    if (message.signature.length !== 0) {
      obj.signature = base64FromBytes(message.signature);
    }
    return obj;
  },
  create(base) {
    return FeePoolClose.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolClose();
    message.spendTxid = object.spendTxid ?? new Uint8Array(0);
    message.serverAmount = object.serverAmount ?? 0;
    message.fee = object.fee ?? 0;
    message.signature = object.signature ?? new Uint8Array(0);
    return message;
  }
};
function createBaseFeePoolStatusQuery() {
  return { spendTxid: new Uint8Array(0) };
}
var FeePoolStatusQuery = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxid.length !== 0) {
      writer.uint32(10).bytes(message.spendTxid);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolStatusQuery();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxid = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { spendTxid: isSet2(object.spendTxid) ? bytesFromBase64(object.spendTxid) : new Uint8Array(0) };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxid.length !== 0) {
      obj.spendTxid = base64FromBytes(message.spendTxid);
    }
    return obj;
  },
  create(base) {
    return FeePoolStatusQuery.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolStatusQuery();
    message.spendTxid = object.spendTxid ?? new Uint8Array(0);
    return message;
  }
};
function createBaseFeePoolStatusResponse() {
  return {
    spendTxid: new Uint8Array(0),
    status: "",
    spendAmount: 0,
    serverAmount: 0,
    fee: 0,
    sequenceNumber: 0,
    createdAt: void 0,
    expiresAt: void 0,
    errorReason: ""
  };
}
var FeePoolStatusResponse = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxid.length !== 0) {
      writer.uint32(10).bytes(message.spendTxid);
    }
    if (message.status !== "") {
      writer.uint32(18).string(message.status);
    }
    if (message.spendAmount !== 0) {
      writer.uint32(24).uint64(message.spendAmount);
    }
    if (message.serverAmount !== 0) {
      writer.uint32(32).uint64(message.serverAmount);
    }
    if (message.fee !== 0) {
      writer.uint32(40).uint64(message.fee);
    }
    if (message.sequenceNumber !== 0) {
      writer.uint32(48).uint32(message.sequenceNumber);
    }
    if (message.createdAt !== void 0) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(58).fork()).join();
    }
    if (message.expiresAt !== void 0) {
      Timestamp.encode(toTimestamp(message.expiresAt), writer.uint32(66).fork()).join();
    }
    if (message.errorReason !== "") {
      writer.uint32(74).string(message.errorReason);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxid = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.status = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }
          message.spendAmount = longToNumber2(reader.uint64());
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }
          message.serverAmount = longToNumber2(reader.uint64());
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }
          message.fee = longToNumber2(reader.uint64());
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }
          message.sequenceNumber = reader.uint32();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }
          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }
          message.expiresAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }
          message.errorReason = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTxid: isSet2(object.spendTxid) ? bytesFromBase64(object.spendTxid) : new Uint8Array(0),
      status: isSet2(object.status) ? globalThis.String(object.status) : "",
      spendAmount: isSet2(object.spendAmount) ? globalThis.Number(object.spendAmount) : 0,
      serverAmount: isSet2(object.serverAmount) ? globalThis.Number(object.serverAmount) : 0,
      fee: isSet2(object.fee) ? globalThis.Number(object.fee) : 0,
      sequenceNumber: isSet2(object.sequenceNumber) ? globalThis.Number(object.sequenceNumber) : 0,
      createdAt: isSet2(object.createdAt) ? fromJsonTimestamp(object.createdAt) : void 0,
      expiresAt: isSet2(object.expiresAt) ? fromJsonTimestamp(object.expiresAt) : void 0,
      errorReason: isSet2(object.errorReason) ? globalThis.String(object.errorReason) : ""
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxid.length !== 0) {
      obj.spendTxid = base64FromBytes(message.spendTxid);
    }
    if (message.status !== "") {
      obj.status = message.status;
    }
    if (message.spendAmount !== 0) {
      obj.spendAmount = Math.round(message.spendAmount);
    }
    if (message.serverAmount !== 0) {
      obj.serverAmount = Math.round(message.serverAmount);
    }
    if (message.fee !== 0) {
      obj.fee = Math.round(message.fee);
    }
    if (message.sequenceNumber !== 0) {
      obj.sequenceNumber = Math.round(message.sequenceNumber);
    }
    if (message.createdAt !== void 0) {
      obj.createdAt = message.createdAt.toISOString();
    }
    if (message.expiresAt !== void 0) {
      obj.expiresAt = message.expiresAt.toISOString();
    }
    if (message.errorReason !== "") {
      obj.errorReason = message.errorReason;
    }
    return obj;
  },
  create(base) {
    return FeePoolStatusResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolStatusResponse();
    message.spendTxid = object.spendTxid ?? new Uint8Array(0);
    message.status = object.status ?? "";
    message.spendAmount = object.spendAmount ?? 0;
    message.serverAmount = object.serverAmount ?? 0;
    message.fee = object.fee ?? 0;
    message.sequenceNumber = object.sequenceNumber ?? 0;
    message.createdAt = object.createdAt ?? void 0;
    message.expiresAt = object.expiresAt ?? void 0;
    message.errorReason = object.errorReason ?? "";
    return message;
  }
};
function createBaseFeePoolListQuery() {
  return { limit: 0, page: 0 };
}
var FeePoolListQuery = {
  encode(message, writer = new BinaryWriter()) {
    if (message.limit !== 0) {
      writer.uint32(8).uint32(message.limit);
    }
    if (message.page !== 0) {
      writer.uint32(16).uint32(message.page);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolListQuery();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.limit = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.page = reader.uint32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      limit: isSet2(object.limit) ? globalThis.Number(object.limit) : 0,
      page: isSet2(object.page) ? globalThis.Number(object.page) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.page !== 0) {
      obj.page = Math.round(message.page);
    }
    return obj;
  },
  create(base) {
    return FeePoolListQuery.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolListQuery();
    message.limit = object.limit ?? 0;
    message.page = object.page ?? 0;
    return message;
  }
};
function createBaseFeePoolListItem() {
  return {
    spendTxId: new Uint8Array(0),
    status: "",
    createAt: void 0,
    isSettled: false,
    remainingServiceSeconds: 0,
    isClose: false
  };
}
var FeePoolListItem = {
  encode(message, writer = new BinaryWriter()) {
    if (message.spendTxId.length !== 0) {
      writer.uint32(10).bytes(message.spendTxId);
    }
    if (message.status !== "") {
      writer.uint32(18).string(message.status);
    }
    if (message.createAt !== void 0) {
      Timestamp.encode(toTimestamp(message.createAt), writer.uint32(26).fork()).join();
    }
    if (message.isSettled !== false) {
      writer.uint32(32).bool(message.isSettled);
    }
    if (message.remainingServiceSeconds !== 0) {
      writer.uint32(40).uint64(message.remainingServiceSeconds);
    }
    if (message.isClose !== false) {
      writer.uint32(48).bool(message.isClose);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolListItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.spendTxId = reader.bytes();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.status = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.createAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }
          message.isSettled = reader.bool();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }
          message.remainingServiceSeconds = longToNumber2(reader.uint64());
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }
          message.isClose = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      spendTxId: isSet2(object.spendTxId) ? bytesFromBase64(object.spendTxId) : new Uint8Array(0),
      status: isSet2(object.status) ? globalThis.String(object.status) : "",
      createAt: isSet2(object.createAt) ? fromJsonTimestamp(object.createAt) : void 0,
      isSettled: isSet2(object.isSettled) ? globalThis.Boolean(object.isSettled) : false,
      remainingServiceSeconds: isSet2(object.remainingServiceSeconds) ? globalThis.Number(object.remainingServiceSeconds) : 0,
      isClose: isSet2(object.isClose) ? globalThis.Boolean(object.isClose) : false
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.spendTxId.length !== 0) {
      obj.spendTxId = base64FromBytes(message.spendTxId);
    }
    if (message.status !== "") {
      obj.status = message.status;
    }
    if (message.createAt !== void 0) {
      obj.createAt = message.createAt.toISOString();
    }
    if (message.isSettled !== false) {
      obj.isSettled = message.isSettled;
    }
    if (message.remainingServiceSeconds !== 0) {
      obj.remainingServiceSeconds = Math.round(message.remainingServiceSeconds);
    }
    if (message.isClose !== false) {
      obj.isClose = message.isClose;
    }
    return obj;
  },
  create(base) {
    return FeePoolListItem.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolListItem();
    message.spendTxId = object.spendTxId ?? new Uint8Array(0);
    message.status = object.status ?? "";
    message.createAt = object.createAt ?? void 0;
    message.isSettled = object.isSettled ?? false;
    message.remainingServiceSeconds = object.remainingServiceSeconds ?? 0;
    message.isClose = object.isClose ?? false;
    return message;
  }
};
function createBaseFeePoolListResponse() {
  return { items: [], totalCount: 0, totalPages: 0 };
}
var FeePoolListResponse = {
  encode(message, writer = new BinaryWriter()) {
    for (const v of message.items) {
      FeePoolListItem.encode(v, writer.uint32(10).fork()).join();
    }
    if (message.totalCount !== 0) {
      writer.uint32(16).uint32(message.totalCount);
    }
    if (message.totalPages !== 0) {
      writer.uint32(24).uint32(message.totalPages);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFeePoolListResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.items.push(FeePoolListItem.decode(reader, reader.uint32()));
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.totalCount = reader.uint32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }
          message.totalPages = reader.uint32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return {
      items: globalThis.Array.isArray(object?.items) ? object.items.map((e) => FeePoolListItem.fromJSON(e)) : [],
      totalCount: isSet2(object.totalCount) ? globalThis.Number(object.totalCount) : 0,
      totalPages: isSet2(object.totalPages) ? globalThis.Number(object.totalPages) : 0
    };
  },
  toJSON(message) {
    const obj = {};
    if (message.items?.length) {
      obj.items = message.items.map((e) => FeePoolListItem.toJSON(e));
    }
    if (message.totalCount !== 0) {
      obj.totalCount = Math.round(message.totalCount);
    }
    if (message.totalPages !== 0) {
      obj.totalPages = Math.round(message.totalPages);
    }
    return obj;
  },
  create(base) {
    return FeePoolListResponse.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFeePoolListResponse();
    message.items = object.items?.map((e) => FeePoolListItem.fromPartial(e)) || [];
    message.totalCount = object.totalCount ?? 0;
    message.totalPages = object.totalPages ?? 0;
    return message;
  }
};
function createBaseFileDemandRequest() {
  return { fileHash: new Uint8Array(0) };
}
var FileDemandRequest = {
  encode(message, writer = new BinaryWriter()) {
    if (message.fileHash.length !== 0) {
      writer.uint32(10).bytes(message.fileHash);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFileDemandRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.fileHash = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { fileHash: isSet2(object.fileHash) ? bytesFromBase64(object.fileHash) : new Uint8Array(0) };
  },
  toJSON(message) {
    const obj = {};
    if (message.fileHash.length !== 0) {
      obj.fileHash = base64FromBytes(message.fileHash);
    }
    return obj;
  },
  create(base) {
    return FileDemandRequest.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFileDemandRequest();
    message.fileHash = object.fileHash ?? new Uint8Array(0);
    return message;
  }
};
function createBaseFileDemandBroadcast() {
  return { fileHash: new Uint8Array(0) };
}
var FileDemandBroadcast = {
  encode(message, writer = new BinaryWriter()) {
    if (message.fileHash.length !== 0) {
      writer.uint32(10).bytes(message.fileHash);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseFileDemandBroadcast();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.fileHash = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  fromJSON(object) {
    return { fileHash: isSet2(object.fileHash) ? bytesFromBase64(object.fileHash) : new Uint8Array(0) };
  },
  toJSON(message) {
    const obj = {};
    if (message.fileHash.length !== 0) {
      obj.fileHash = base64FromBytes(message.fileHash);
    }
    return obj;
  },
  create(base) {
    return FileDemandBroadcast.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseFileDemandBroadcast();
    message.fileHash = object.fileHash ?? new Uint8Array(0);
    return message;
  }
};
function bytesFromBase64(b64) {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}
function base64FromBytes(arr) {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}
function toTimestamp(date) {
  const seconds = Math.trunc(date.getTime() / 1e3);
  const nanos = date.getTime() % 1e3 * 1e6;
  return { seconds, nanos };
}
function fromTimestamp(t) {
  let millis = (t.seconds || 0) * 1e3;
  millis += (t.nanos || 0) / 1e6;
  return new globalThis.Date(millis);
}
function fromJsonTimestamp(o) {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}
function longToNumber2(int64) {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}
function isSet2(value) {
  return value !== null && value !== void 0;
}

// src/encode.ts
function deterministicMarshal(env) {
  return Envelope.encode(env, new BinaryWriter()).finish();
}

// src/sign.ts
var import_Hash = require("@bsv/sdk/primitives/Hash");
var import_buffer = require("buffer");
var import_ECDSA = require("@bsv/sdk/primitives/ECDSA");
var import_utils = require("@bsv/sdk/primitives/utils");
var import_BigNumber = __toESM(require("@bsv/sdk/primitives/BigNumber"));
function signEnvelope(env, priv) {
  const clone = { ...env, signature: import_buffer.Buffer.alloc(0), signatureAlgo: "" };
  const sigInput = deterministicMarshal(clone);
  const digest = (0, import_Hash.sha256)(sigInput);
  const digestBN = new import_BigNumber.default((0, import_utils.toHex)(digest), 16);
  const sigObj = (0, import_ECDSA.sign)(digestBN, priv, true);
  const der = sigObj.toDER();
  env.signature = import_buffer.Buffer.from(der);
  env.signatureAlgo = "ECDSA_SECP256K1_SHA256";
}

// src/verify.ts
var import_Hash2 = require("@bsv/sdk/primitives/Hash");
var import_Signature = __toESM(require("@bsv/sdk/primitives/Signature"));
var import_PublicKey = __toESM(require("@bsv/sdk/primitives/PublicKey"));
var import_BigNumber2 = __toESM(require("@bsv/sdk/primitives/BigNumber"));
var import_ECDSA2 = require("@bsv/sdk/primitives/ECDSA");
var import_utils2 = require("@bsv/sdk/primitives/utils");
var import_PrivateKey = __toESM(require("@bsv/sdk/primitives/PrivateKey"));
var import_buffer2 = require("buffer");
var anyoneKey = new import_PrivateKey.default(1);
function verifyEnvelope(env) {
  if (env.signatureAlgo !== "ECDSA_SECP256K1_SHA256") return false;
  const clone = { ...env, signature: import_buffer2.Buffer.alloc(0), signatureAlgo: "" };
  const sigInput = deterministicMarshal(clone);
  const digest = (0, import_Hash2.sha256)(sigInput);
  const sigObj = import_Signature.default.fromDER(env.signature);
  const digestBN = new import_BigNumber2.default((0, import_utils2.toHex)(digest), 16);
  const pubBytes = env.header?.fromPubkey ?? new Uint8Array();
  const pubKey = import_PublicKey.default.fromDER([...pubBytes]);
  const ok = (0, import_ECDSA2.verify)(digestBN, sigObj, pubKey);
  return ok;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Envelope,
  ErrorReply,
  FeePoolBaseTx,
  FeePoolClose,
  FeePoolCreate,
  FeePoolListItem,
  FeePoolListQuery,
  FeePoolListResponse,
  FeePoolSign,
  FeePoolStatusQuery,
  FeePoolStatusResponse,
  FeePoolUpdate,
  FeePoolUpdateNotify,
  FileDemandBroadcast,
  FileDemandRequest,
  Header,
  MsgKind,
  WSSignaling,
  deterministicMarshal,
  msgKindFromJSON,
  msgKindToJSON,
  protobufPackage,
  signEnvelope,
  verifyEnvelope
});
//# sourceMappingURL=index.js.map