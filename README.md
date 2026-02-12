# Game Dev Agent System

Claude Codeを活用したマルチエージェントゲーム開発システム。

## 概要

このシステムは、Claude Codeの機能（Skills, Subagents, Hooks）を組み合わせて、
効率的なWebゲーム開発ワークフローを提供します。

## ディレクトリ構造

```
casual-game-creation/
├── .claude/                    # 開発システム設定
│   ├── commands/               # Skills（12個のカスタムコマンド）
│   └── scripts/                # 自動化スクリプト
├── projects/                   # ゲームプロジェクト群
│   └── bounce-escape/          # サンプルプロジェクト
├── shared/                     # 共通リソース
│   └── templates/              # プロジェクトテンプレート
├── knowledge/                  # 横断的な知見
│   ├── patterns.md             # 効果的なパターン
│   ├── pitfalls.md             # 避けるべき落とし穴
│   └── reusable-code/          # 再利用可能コード（6モジュール）
└── game-dev-agent-system-design.md  # システム設計書
```

## クイックスタート

### 1. 新規プロジェクト作成
```
/init-project my-game
```

### 2. GDD作成
```
cd projects/my-game
/design-gdd シンプルなクリッカーゲーム
```

### 3. 実装
```
/implement-feature コア移動
/implement-feature スコアシステム
```

### 4. プレイテスト & QA
```
/playtest-review
/qa-review
/fix-bugs all
```

### 5. 翻訳 & アセット
```
/i18n-check
/translate en
/asset-design
/sound-design
```

### 6. リリース
```
/write-description
/release v1.0.0
```

## 使用可能なSkills（12個）

| Skill | 説明 | フェーズ |
|-------|------|---------|
| `/init-project <name>` | 新規プロジェクト作成 | 初期化 |
| `/design-gdd <concept>` | GDD作成・更新 | 設計 |
| `/implement-feature <feature>` | 機能実装 | 実装 |
| `/fix-bugs [id\|all]` | バグ修正 | 実装 |
| `/playtest-review` | プレイテストUXレビュー | 品質 |
| `/qa-review` | 品質レビュー・バグ検出 | 品質 |
| `/i18n-check` | 翻訳チェック | 国際化 |
| `/translate <lang>` | 翻訳実行 | 国際化 |
| `/asset-design` | ビジュアルアセット設計 | アセット |
| `/sound-design` | サウンド設計 | アセット |
| `/write-description` | 説明文・マーケティング | リリース |
| `/release <version>` | リリース準備 | リリース |

## エージェント構成

| エージェント | 役割 | 実装 |
|-------------|------|------|
| Orchestrator | 全体統括 | Claude Code本体 |
| Designer | 設計 | `/design-gdd`, `/asset-design` |
| Developer | 実装 | `/implement-feature`, `/fix-bugs` |
| QA | 品質検証 | `/qa-review`, `/playtest-review` |
| Localization | 国際化 | `/i18n-check`, `/translate` |
| Sound | サウンド | `/sound-design` |
| Writer | ライティング | `/write-description` |
| DevOps | リリース | `/release`, `/init-project` |

## 再利用可能コード

| モジュール | 説明 |
|-----------|------|
| `seeded-random.js` | シード付き乱数（デイリーチャレンジ） |
| `storage.js` | localStorage ラッパー |
| `use-game-loop.js` | ゲームループ React Hook |
| `sound-manager.js` | Web Audio API サウンドマネージャー |
| `fps-monitor.js` | FPS計測ツール |
| `analytics.js` | 簡易アナリティクス |

## 技術スタック

- React 19 / Vite 7 / Tailwind CSS 4 / i18next / vitest

## 詳細

システム設計の詳細は [game-dev-agent-system-design.md](game-dev-agent-system-design.md) を参照。
