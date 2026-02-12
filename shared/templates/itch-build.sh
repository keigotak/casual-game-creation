#!/bin/bash
# itch.io用ビルドスクリプト
# 使い方: ./itch-build.sh [version]

set -e

VERSION=${1:-$(node -p "require('./package.json').version")}
PROJECT_NAME=$(node -p "require('./package.json').name")

echo "=== itch.io Build ==="
echo "Project: $PROJECT_NAME"
echo "Version: $VERSION"
echo ""

# ビルド
echo "[1/3] Building..."
npm run build

# ZIP作成
echo "[2/3] Creating ZIP..."
cd dist
ZIP_NAME="../${PROJECT_NAME}-v${VERSION}.zip"
rm -f "$ZIP_NAME"
zip -r "$ZIP_NAME" .
cd ..

# 完了
echo "[3/3] Done!"
echo ""
echo "=== Build Complete ==="
echo "ZIP: ${PROJECT_NAME}-v${VERSION}.zip"
echo ""
echo "Next steps:"
echo "1. Go to https://itch.io/game/new (or your game's Edit page)"
echo "2. Upload the ZIP file"
echo "3. Check 'This file will be played in the browser'"
echo "4. Set embed size (recommended: 800x600)"
echo "5. Save & Publish"
