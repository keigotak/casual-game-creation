#!/bin/bash
# i18n自動チェックスクリプト
# ファイル編集後に翻訳キーの漏れを検出

set -e

# i18nディレクトリが存在するか確認
if [ ! -d "src/i18n/locales" ]; then
    exit 0
fi

echo "=== i18n Quick Check ==="

# ハードコードされた日本語文字列を検出（JSX内）
echo "Checking for hardcoded Japanese strings..."

# src内のjsx/jsファイルをチェック
HARDCODED=$(grep -r --include="*.jsx" --include="*.js" -E ">[^<]*[ぁ-んァ-ン一-龥]" src/ 2>/dev/null | grep -v "node_modules" | grep -v "i18n" | head -5 || true)

if [ -n "$HARDCODED" ]; then
    echo "[WARN] Potential hardcoded strings found:"
    echo "$HARDCODED"
    echo ""
    echo "Consider using t('key') for these strings."
else
    echo "[OK] No obvious hardcoded strings found"
fi

# 言語ファイル間のキー差分チェック
if [ -f "src/i18n/locales/ja.json" ] && [ -f "src/i18n/locales/en.json" ]; then
    JA_KEYS=$(jq -r 'paths(scalars) | join(".")' src/i18n/locales/ja.json 2>/dev/null | sort || true)
    EN_KEYS=$(jq -r 'paths(scalars) | join(".")' src/i18n/locales/en.json 2>/dev/null | sort || true)

    MISSING_EN=$(comm -23 <(echo "$JA_KEYS") <(echo "$EN_KEYS") | head -5)
    MISSING_JA=$(comm -13 <(echo "$JA_KEYS") <(echo "$EN_KEYS") | head -5)

    if [ -n "$MISSING_EN" ]; then
        echo "[WARN] Keys in ja.json but not in en.json:"
        echo "$MISSING_EN"
    fi

    if [ -n "$MISSING_JA" ]; then
        echo "[WARN] Keys in en.json but not in ja.json:"
        echo "$MISSING_JA"
    fi

    if [ -z "$MISSING_EN" ] && [ -z "$MISSING_JA" ]; then
        echo "[OK] Translation keys are in sync"
    fi
fi

echo "=== i18n Quick Check Complete ==="
