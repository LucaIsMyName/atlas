#!/bin/bash

# Clean previous builds
rm -rf dist release

# Build React app
npm run build

# Build Electron main process
npm run build:electron

# Ensure preload script is in the right place
cp src/main/preload.cjs dist/main/

# Build universal binary
npm run binary