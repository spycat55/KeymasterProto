#!/bin/bash

set -e  # 如果任何命令失败则退出

# 定义目录
PROTO_DIR="./proto/v1"
GO_OUT_DIR="./gen/go"
TS_OUT_DIR="./gen/ts"

# 检查 protoc 是否安装
if ! command -v protoc &> /dev/null; then
    echo "错误: protoc 未安装. 请先安装 Protocol Buffers 编译器."
    echo "安装方法: https://grpc.io/docs/protoc-installation/"
    exit 1
fi

# 设置 PATH 以包含 Go 的 bin 目录
export PATH=$PATH:$(go env GOPATH)/bin

# 检查 protoc-gen-go 是否安装
if ! command -v protoc-gen-go &> /dev/null; then
    echo "错误: protoc-gen-go 未安装或不在 PATH 中."
    echo "请运行 ./install_tools.sh 安装所需工具."
    exit 1
else
    echo "protoc-gen-go 已安装."
fi

# 检查 protoc-gen-go-grpc 是否安装
if ! command -v protoc-gen-go-grpc &> /dev/null; then
    echo "错误: protoc-gen-go-grpc 未安装或不在 PATH 中."
    echo "请运行 ./install_tools.sh 安装所需工具."
    exit 1
else
    echo "protoc-gen-go-grpc 已安装."
fi

# 检查 ts-proto 是否安装
if [ ! -d "./node_modules/ts-proto" ]; then
    echo "错误: ts-proto 未在本地安装."
    echo "请运行 ./install_tools.sh 安装所需工具."
    exit 1
else
    echo "ts-proto 已安装."
fi

# 清理旧输出
rm -rf "${GO_OUT_DIR}"
rm -rf "${TS_OUT_DIR}"

# 创建输出目录
mkdir -p "${GO_OUT_DIR}"
mkdir -p "${TS_OUT_DIR}"
mkdir -p "${TS_OUT_DIR}/google/protobuf"


# 编译 Go 代码
echo "正在生成 Go 代码..."
protoc -I ${PROTO_DIR} \
  --go_out=${GO_OUT_DIR} \
  --go_opt=paths=source_relative \
  --go-grpc_out=${GO_OUT_DIR} \
  --go-grpc_opt=paths=source_relative \
  ${PROTO_DIR}/*.proto

# 编译 TypeScript 代码 - 使用 ts-proto
echo "正在生成 TypeScript 代码..."
protoc -I ${PROTO_DIR} \
  --plugin=protoc-gen-ts_proto=$(pwd)/node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=${TS_OUT_DIR} \
  --ts_proto_opt=outputServices=false,outputClientImpl=false,useOptionals=messages,onlyTypes=true \
  ${PROTO_DIR}/*.proto

# 处理文件名，将 _pb.ts 重命名为 .ts
# for file in ${TS_OUT_DIR}/*_pb.ts; do
#   if [ -f "$file" ]; then
#     new_name=$(echo "$file" | sed 's/_pb\.ts$/.ts/')
#     mv "$file" "$new_name"
#   fi
# done

# 生成 google/protobuf/timestamp.ts 文件
# echo "正在生成 google/protobuf/timestamp.ts..."
# protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
#   --ts_proto_out=${TS_OUT_DIR} \
#   --ts_proto_opt=outputServices=grpc-js,env=node,esModuleInterop=true,useOptionals=messages \
#   google/protobuf/timestamp.proto

echo "Proto 文件编译完成！"
echo "Go 代码已生成到: ${GO_OUT_DIR}"
echo "TypeScript 代码已生成到: ${TS_OUT_DIR}"
