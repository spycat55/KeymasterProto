# Release Notes

## v0.2.0 (2025-08-11)

### 变更
- 统一费用池相关字段为 `spend_txid`，并在注释中明确：
  - 32 字节，小端序；十六进制展示为大端序；必填且不可为空（除 `FeePoolStatusQuery` 外）。
- `FeePoolBaseTx` 字段重新编排：
  - `spend_txid = 1`，`base_tx = 2`，`client_signature = 3`。
- `FeePoolUpdateNotify`/`FeePoolUpdate`/`FeePoolClose`/`FeePoolSign`/`FeePoolStatusResponse` 等消息的 `spend_txid` 注释补充端序与必填说明。
- `FeePoolClose` 字段号顺序修正为：`spend_txid = 1`，`server_amount = 2`，`fee = 3`，`signature = 4`。

### 兼容性
- 本次为首版发布前（v1 前）协议整理，存在不兼容改动（字段号调整）。

### 安装

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.2.0
```

#### npm Package
```bash
npm install keymaster_proto@0.2.0
```

## v0.1.9 (2025-07-28)

### Changes
- **FeePoolUpdate message structure simplified**: Removed `spend_txid` and `operation_type` fields, keeping only `base_txid` and `client_signature` for cleaner protocol implementation
- Updated npm package version to 0.1.9
- Regenerated Go and TypeScript code with simplified message structure

### Breaking Changes
- `FeePoolUpdate` message structure changed - removed fields 2 and 4, renumbered `client_signature` from field 3 to field 2

### Installation

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.1.9
```

#### npm Package
```bash
npm install keymaster_proto@0.1.9
```

## v0.1.8 (2025-07-27)

### Features
- **FeePoolClose**: Added `client_signature` field to FeePoolClose message
  - Proto field: `bytes client_signature = 4;`
  - Go field: `ClientSignature []byte`
  - TypeScript field: `clientSignature: Uint8Array`

### Changes
- Updated npm package version to 0.1.8
- Regenerated Go and TypeScript code with new field
- All existing fields remain unchanged for backward compatibility

### Usage

#### Go
```go
feePoolClose := &FeePoolClose{
    BaseTxid:        baseTxid,
    ServerAmount:    serverAmount,
    Fee:            fee,
    ClientSignature: clientSignature, // New field
}
```

#### TypeScript
```typescript
const feePoolClose: FeePoolClose = {
    baseTxid: baseTxid,
    serverAmount: serverAmount,
    fee: fee,
    clientSignature: clientSignature, // New field
};
```

### Installation

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.1.8
```

#### npm Package
```bash
npm install keymaster_proto@0.1.8
```