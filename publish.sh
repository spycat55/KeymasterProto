#!/bin/bash

set -e

VERSION=$(node -p "require('./package.json').version")
echo "Publishing keymaster_proto v${VERSION}..."

# Check if logged in
if ! npm whoami > /dev/null 2>&1; then
    echo "Error: Not logged in to npm. Please run 'npm login' first."
    exit 1
fi

# Generate proto code (Go/TS)
echo "Generating proto code..."
./compile_proto.sh

# Build the project
echo "Building project..."
npm ci
npm run build

if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

# Publish to npm
echo "Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    echo "✅ Successfully published keymaster_proto@${VERSION} to npm!"
    echo ""
    echo "Installation:"
    echo "npm install keymaster_proto@${VERSION}"
    echo ""
    echo "Go module is also available:"
    echo "go get github.com/spycat55/KeymasterProto@v${VERSION}"
else
    echo "❌ Failed to publish to npm"
    exit 1
fi