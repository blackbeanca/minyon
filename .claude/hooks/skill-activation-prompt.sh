#!/bin/bash

# Change to the hooks directory to ensure relative paths work
HOOKS_DIR="$(dirname "$0")"
cd "$HOOKS_DIR" || exit 1

# Run the TypeScript hook processor
cat | npx tsx skill-activation-prompt.ts
