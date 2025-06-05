# KeymasterProto

这个仓库包含 Protocol Buffer 源文件，以及编译后的 Go 和 TypeScript 文件。

## 项目结构

```
├── proto/v1/          # Protocol Buffer 源文件
├── go/                # 编译后的 Go 文件
├── src/proto/         # TypeScript 相关文件
│   ├── v1/            # 复制的 Proto 源文件
│   └── generated/     # 编译后的 TypeScript 文件
├── install_tools.sh   # 安装所需工具的脚本
├── compile_proto.sh   # 编译 Proto 为 Go 和单个 TS 文件的脚本
└── compile_proto_ts.sh # 编译 Proto 为 Go 和分离的 TS 文件的脚本
```

## 安装工具

运行以下命令安装所需的工具：

```bash
# 添加执行权限
chmod +x install_tools.sh

# 运行安装脚本
./install_tools.sh
```

该脚本将安装：
- protoc-gen-go 和 protoc-gen-go-grpc (Go 的 Protocol Buffers 编译器插件)
- ts-proto (TypeScript 的 Protocol Buffers 编译器插件)

## 编译 Proto 文件

### 方法一：编译为单个 TypeScript 文件

```bash
# 添加执行权限
chmod +x compile_proto.sh

# 运行编译脚本
./compile_proto.sh
```

这将生成：
- Go 文件在 `./go/` 目录下
- 单个 TypeScript 文件在 `./ts/` 目录下

### 方法二：编译为分离的 TypeScript 文件

```bash
# 添加执行权限
chmod +x compile_proto_ts.sh

# 运行编译脚本
./compile_proto_ts.sh
```

这将生成：
- Go 文件在 `./go/` 目录下
- 分离的 TypeScript 文件在 `./src/proto/generated/` 目录下，每个 proto 文件对应一个 TypeScript 文件
