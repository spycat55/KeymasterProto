#!/bin/bash

echo "Publishing keymaster_proto v0.1.8..."

# Check if logged in
if ! npm whoami > /dev/null 2>&1; then
    echo "Error: Not logged in to npm. Please run 'npm login' first."
    exit 1
fi

# Build the project
echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Error: Build failed"
    exit 1
fi

# Publish to npm
echo "Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    echo "✅ Successfully published keymaster_proto@0.1.8 to npm!"
    echo ""
    echo "Installation:"
    echo "npm install keymaster_proto@0.1.8"
    echo ""
    echo "Go module is also available:"
    echo "go get github.com/spycat55/KeymasterProto@v0.1.8"
else
    echo "❌ Failed to publish to npm"
    exit 1
fi