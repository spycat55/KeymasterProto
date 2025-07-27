# Release Notes

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