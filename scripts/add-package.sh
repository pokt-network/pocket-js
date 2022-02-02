#!/bin/bash

# Important: run this script from the root directory, or it won't work.

PKG_NAME=$1

echo "Creating directory..."
echo $PKG_NAME
mkdir packages/${PKG_NAME} && mkdir ./packages/${PKG_NAME}/src && mkdir ./packages/${PKG_NAME}/tests && touch packages/${PKG_NAME}/src/index.ts && touch packages/${PKG_NAME}/tests/${PKG_NAME}.test.ts
echo "Installing deps"
cd packages/${PKG_NAME} && pnpm init -y && pnpm i -D @types/jest @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint jest microbundle prettier prettier-eslint ts-jest && cd .. && cd ..
echo "Creating config files"
cp packages/pocket/.eslintrc.json packages/pocket/.prettierrc.json packages/pocket/jest.config.js packages/pocket/tsconfig.json ./packages/${PKG_NAME}/
echo "All done! A few manual steps:"
echo "- Set the package name and version accordingly."
echo "- Configure microbundle for builds."
echo "- Configure global scripts for this package."
