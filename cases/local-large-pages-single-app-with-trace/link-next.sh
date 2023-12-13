#!/bin/bash

echo "Linking next.js packages"

NEXT_DIR=$1

# next
pnpm add $NEXT_DIR/packages/next
# react
pnpm add $NEXT_DIR/node_modules/react
# react-dom
pnpm add $NEXT_DIR/node_modules/react-dom