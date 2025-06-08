#!/bin/bash

set -e  # 如果任何命令失败则退出

echo "开始安装 Protocol Buffers 工具..."

# 检查 Go 是否安装
if ! command -v go &> /dev/null; then
    echo "错误: Go 未安装. 请先安装 Go."
    exit 1
fi

# 强制重新安装 protoc
echo "正在下载并安装 protoc v6.30.2..."

# 创建临时目录
TMP_DIR=$(mktemp -d)
cd $TMP_DIR

# 下载最新稳定版的 protoc
PROTOC_VERSION=26.1
PROTOC_ZIP=protoc-${PROTOC_VERSION}-linux-x86_64.zip

echo "正在下载 protoc v${PROTOC_VERSION}..."

# 从 GitHub 下载
if ! curl -L -o $PROTOC_ZIP \
    https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOC_VERSION}/$PROTOC_ZIP; then
    echo "错误: 无法下载 protoc v${PROTOC_VERSION}. 请检查网络连接."
    echo "下载链接: https://github.com/protocolbuffers/protobuf/releases/tag/v${PROTOC_VERSION}"
    exit 1
fi

echo "正在安装 protoc v${PROTOC_VERSION}..."

# 检查下载的文件是否有效
if ! unzip -t $PROTOC_ZIP >/dev/null 2>&1; then
    echo "错误: 下载的文件不是有效的 ZIP 文件. 可能是下载中断或版本不存在."
    rm -f $PROTOC_ZIP
    exit 1
fi

# 确保目标目录存在
mkdir -p $HOME/.local/bin
mkdir -p $HOME/.local/include

# 解压并覆盖现有文件
unzip -o protoc-${PROTOC_VERSION}-linux-x86_64.zip -d $HOME/.local

# 添加 $HOME/.local/bin 到 PATH
export PATH="$HOME/.local/bin:$PATH"

# 验证安装
if ! command -v protoc &> /dev/null; then
    echo "错误: 无法安装 protoc. 请手动安装."
    echo "参考: https://grpc.io/docs/protoc-installation/"
    cd - > /dev/null
    rm -rf $TMP_DIR
    exit 1
fi

# 清理
cd - > /dev/null
rm -rf $TMP_DIR

echo "protoc v${PROTOC_VERSION} 已成功安装到 $HOME/.local/bin"

# 安装 Go 的 protoc 插件
echo "安装 Go 的 protoc 插件..."
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# 检查 bun 是否安装
if ! command -v bun &> /dev/null; then
    echo "警告: bun 未安装. 跳过 TypeScript 相关工具安装."
    echo "如果您需要 TypeScript 支持，请先安装 Node.js 和 bun."
else
    # 安装 TypeScript 的 protoc 插件
    echo "安装 TypeScript 的 protoc 插件..."
    if ! bun install --save-dev typescript ts-proto; then
        echo "警告: 安装 TypeScript 相关工具失败. 跳过..."
    fi
fi

# 确保 GOPATH/bin 在 PATH 中
export PATH="$PATH:$(go env GOPATH)/bin"

# 输出安装的工具版本
echo -e "\n安装完成. 工具版本信息:"
echo "Go 版本: $(go version)"
echo "protoc 版本: $(protoc --version 2>/dev/null || echo '未找到')"
echo "protoc-gen-go 已安装到: $(which protoc-gen-go 2>/dev/null || echo '未找到')"
echo "protoc-gen-go-grpc 已安装到: $(which protoc-gen-go-grpc 2>/dev/null || echo '未找到')"

# 检查 TypeScript 工具
if command -v bun &> /dev/null; then
    echo -n "TypeScript 版本: "
    if bunx tsc --version 2>/dev/null; then
        echo "ts-proto 已安装"
    else
        echo "TypeScript 相关工具未正确安装"
    fi
fi

# 提示用户设置 PATH
echo -e "\n请确保将以下路径添加到您的 PATH 环境变量中:"
echo "$(go env GOPATH)/bin"
echo -e "\n可以通过在 ~/.bashrc 或 ~/.zshrc 中添加以下行来实现:"
echo "export PATH=\$PATH:$(go env GOPATH)/bin"
echo -e "\n要使更改立即生效，请运行:"
echo "source ~/.bashrc  # 如果使用 bash"
echo "# 或"
echo "source ~/.zshrc   # 如果使用 zsh"
