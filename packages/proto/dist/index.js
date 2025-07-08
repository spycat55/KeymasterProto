var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  MsgKind: () => MsgKind,
  protobufPackage: () => protobufPackage
});
module.exports = __toCommonJS(index_exports);

// ../../gen/ts/message.ts
var protobufPackage = "api.webrtc.v1";
var MsgKind = /* @__PURE__ */ ((MsgKind2) => {
  MsgKind2[MsgKind2["KIND_UNSPECIFIED"] = 0] = "KIND_UNSPECIFIED";
  MsgKind2[MsgKind2["KIND_ERROR"] = 1] = "KIND_ERROR";
  MsgKind2[MsgKind2["KIND_WS_SIGNALING"] = 2] = "KIND_WS_SIGNALING";
  MsgKind2[MsgKind2["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
  return MsgKind2;
})(MsgKind || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MsgKind,
  protobufPackage
});
