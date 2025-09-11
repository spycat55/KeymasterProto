## v0.5.4 (2025-09-11)

### 变更
- bump npm 版本至 0.5.4

### 兼容性
- 保持向后兼容

### 安装

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.5.4
```

#### npm Package
```bash
npm install keymaster_proto@0.5.4
```

# Release Notes

## v0.5.3 (2025-09-09)

### 变更
- bump npm 版本至 0.5.3

### 兼容性
- 保持向后兼容

### 安装

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.5.3
```

#### npm Package
```bash
npm install keymaster_proto@0.5.3
```

## v0.5.1 (2025-09-07)
# Release Notes

## v0.5.1 (2025-09-07)

### 变更
- 费用池列表协议更新：`FeePoolListItem` 新增字段
  - `uint64 remaining_service_seconds = 5;`（剩余服务时间，单位：秒）
  - `bool is_close = 6;`（是否关闭）
- bump npm 版本至 `0.5.1`

### 兼容性
- 向后兼容的字段新增（不影响现有客户端/服务端解码）

### 安装

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.5.1
```

#### npm Package
```bash
npm install keymaster_proto@0.5.1
```

## v0.5.0 (2025-08-30)

### 变更
- FeePoolListItem 新增字段：`bool is_settled = 4`（是否结算）
- 重新生成 Go 与 TypeScript 代码

### 兼容性
- 保持向后兼容

### 安装

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.5.0
```

#### npm Package
```bash
npm install keymaster_proto@0.5.0
```

## v0.4.0 (2025-08-29)

### 变更
- 版本升级到0.4.0
- 重新生成 Go 与 TypeScript 代码

### 兼容性
- 保持向后兼容

### 安装

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.4.0
```

#### npm Package
```bash
npm install keymaster_proto@0.4.0
```

## v0.3.0 (2025-08-23)

### 变更
- FeePoolCreate 新增字段：`uint64 input_amount = 2`。
- 重新生成 Go 与 TypeScript 代码（`./compile_proto.sh`）。

### 兼容性
- Protobuf 级别为向后兼容新增；但上层服务可能将该字段视为业务必填，建议尽快升级。

### 安装

#### Go Module
```bash
go get github.com/spycat55/KeymasterProto@v0.3.0
```

#### npm Package
```bash
npm install keymaster_proto@0.3.0
```

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
