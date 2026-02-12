#!/bin/bash
# 品質チェックスクリプト
# pre-commit hookから呼び出される

set -e

echo "=== Quality Check ==="

# package.jsonが存在するか確認
if [ ! -f "package.json" ]; then
    echo "[SKIP] package.json not found"
    exit 0
fi

# npm scriptsの存在確認と実行
run_if_exists() {
    local script=$1
    if npm run --silent "$script" --if-present 2>/dev/null; then
        echo "[PASS] $script"
    else
        if grep -q "\"$script\"" package.json 2>/dev/null; then
            echo "[FAIL] $script"
            return 1
        else
            echo "[SKIP] $script (not defined)"
        fi
    fi
}

# Lint
run_if_exists "lint"

# TypeCheck
run_if_exists "typecheck"

# Build check (dry-run if available)
run_if_exists "build"

echo "=== Quality Check Complete ==="
