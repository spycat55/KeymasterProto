# KeymasterProto

跨语言（Go + TypeScript）统一的消息协议定义与工具集。

* Go 模块：`github.com/spycat55/keymaster_proto`
* npm 包：`@spycat55/keymaster_proto`、`@spycat55/keymaster_utils`

---

## 目录结构

```text
├── proto/               # *.proto 源文件
│   └── v1/message.proto
├── gen/                 # 生成代码（脚本自动覆盖）
│   ├── go/              # protoc-gen-go 输出
│   └── ts/              # ts-proto 输出
├── pkg/                 # 手写 Go 工具
│   ├── encode/
│   ├── sign/
│   └── verify/
├── src/                 # TypeScript source files
│   ├── encode.ts        # Deterministic Marshal
│   ├── sign.ts          # Envelope signing
│   ├── verify.ts        # Envelope verification
│   └── index.ts         # Main exports (proto types + utils)
├── compile_proto.sh     # 一键生成 Go + TS 代码
└── install_tools.sh     # 安装 protoc / 插件 / ts-proto
```

---

## 准备工作

```bash
# 安装 protoc & 插件（仅一次）
chmod +x install_tools.sh && ./install_tools.sh

# 安装 npm 依赖
npm install          # 或 bun install / pnpm install
```

---

## 重新生成代码

```bash
chmod +x compile_proto.sh
./compile_proto.sh
```

生成结果：
* Go：`gen/go/...`
* TypeScript：`gen/ts/...`

---

## 使用方式

### Go

```go
import (
    v1 "github.com/spycat55/keymaster_proto/gen/go"
    signpkg "github.com/spycat55/keymaster_proto/pkg/sign"
)

// ...
```

#### Go 子包拆分说明

| 子包 | 说明 |
|------|------|
| `gen/go` | protoc 生成的 **纯类型定义**，无第三方依赖 |
| `pkg/encode` | Deterministic Marshal（稳定字段顺序） |
| `pkg/sign` | 使用 `go-sdk` 进行签名，依赖 `ec`/`hash` 库 |
| `pkg/verify` | 验证签名，同样依赖加密库 |

保持 **单一 Go module**，但通过子包做关注点分离：

```go
// 仅序列化/反序列化
import v1 "github.com/spycat55/keymaster_proto/gen/go"

// 需要签名时额外引入
import sign "github.com/spycat55/keymaster_proto/pkg/sign"
import verify "github.com/spycat55/keymaster_proto/pkg/verify"
```

这样使用者可以按需引入，`go mod graph` 也仅会拉取必要依赖。

### TypeScript / Bun / Node

```bash
# 安装主包
npm install keymaster_proto

# 安装必需的peer依赖
npm install @bsv/sdk
```

```ts
import { Envelope, signEnvelope, verifyEnvelope } from 'keymaster_proto';
```

**注意：** 从 v0.1.5 开始，`@bsv/sdk` 作为 peer dependency，需要用户单独安装。

---

## 手动发布指南

### 发布 Go 模块

下面示例以 **v1.0.0** 为例演示完整流程：

```bash
# 0. 运行测试，确保无误
go test ./...

# 1. 提交代码
git add .
git commit -m "feat: prepare v0.1.5"

# 2. 打标签（必须以 v 开头）
git tag -a v0.1.5 -m "release v0.1.5"

# 3. 推送代码与标签
git push origin main --follow-tags   # 或
# git push origin v1.0.0

# 4. （可选）验证版本已被 Go 代理抓取
GO111MODULE=on go list -m -versions github.com/spycat55/keymaster_proto

# 5. 用户侧引用
go get github.com/spycat55/keymaster_proto@v0.1.2
```

### 发布 npm 包

1. **对齐版本号**：修改 `package.json` 中的 `version` 字段（如 `1.0.0`）

2. **重新生成代码 & 可选构建**

```bash
./compile_proto.sh

# 若希望发布编译后产物（非必需）
npm run build
```

3. **登录 npm（仅首次）**

```bash
npm login   # 或使用 NPM_TOKEN 环境变量
```

4. **发布**

```bash
npm publish --access public
```

发布成功后，用户即可：

```bash
npm i keymaster_proto
```

---

## 测试

```bash
# Go ↔ TS 交叉签名 / 验证
go test ./...
```

---

## License

MIT