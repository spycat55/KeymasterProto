#!/bin/bash

set -e  # 如果任何命令失败则退出

echo "开始安装 Protocol Buffers 工具..."

# 检查 Go 是否安装
if ! command -v go &> /dev/null; then
    echo "错误: Go 未安装. 请先安装 Go."
    exit 1
fi

# 安装 Go 的 protoc 插件
echo "安装 Go 的 protoc 插件..."
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装. 请先安装 Node.js 和 npm."
    exit 1
fi

# 安装 TypeScript 的 protoc 插件
echo "安装 TypeScript 的 protoc 插件..."
npm install --save-dev typescript ts-proto

# 输出安装的工具版本
echo "安装完成. 工具版本信息:"
echo "Go 版本: $(go version)"
echo "protoc-gen-go 已安装到: $(which protoc-gen-go)"
echo "protoc-gen-go-grpc 已安装到: $(which protoc-gen-go-grpc)"
echo "TypeScript 版本: $(npx tsc --version)"
echo "ts-proto 已安装"

# 提示用户设置 PATH
echo ""
echo "请确保将以下路径添加到您的 PATH 环境变量中:"
echo "$(go env GOPATH)/bin"
echo ""
echo "可以通过在 ~/.bashrc 或 ~/.zshrc 中添加以下行来实现:"
echo "export PATH=\$PATH:\$(go env GOPATH)/bin"
