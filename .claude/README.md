# Game Dev Agent System - Claude Code設定

## 概要

Claude Codeをマルチエージェントゲーム開発システムとして使用するための設定です。

## Skills一覧

### プロジェクト管理

| Skill | 説明 |
|-------|------|
| `/init-project <name>` | `projects/` に新規ゲーム作成 |
| `/release <version>` | リリース準備（itch.io対応） |

### 設計

| Skill | 説明 |
|-------|------|
| `/design-gdd <concept>` | GDD作成・更新 |
| `/asset-design` | アイコン・UI素材・ビジュアルアセット設計 |
| `/sound-design` | 効果音・BGM設計・管理 |

### コンテンツ

| Skill | 説明 |
|-------|------|
| `/write-description` | itch.io説明文・README・SNS投稿文作成 |
| `/translate <lang>` | 翻訳実行 |

### 品質管理

| Skill | 説明 |
|-------|------|
| `/qa-review` | 品質レビュー・バグ検出 |
| `/i18n-check` | 翻訳漏れ・整合性チェック |

## ワークフロー

```
/init-project game-name
       ↓
/design-gdd コンセプト
       ↓
   [実装]
       ↓
/qa-review
       ↓
/i18n-check → /translate en
       ↓
/asset-design        # アイコン・ファビコン
       ↓
/sound-design        # 効果音・BGM
       ↓
/write-description   # itch.io説明文
       ↓
/release v1.0.0
```

## プロジェクトメモリ

各プロジェクト内 `.project_memory/`:

| ファイル | 用途 | 更新Skill |
|---------|------|----------|
| `gdd.md` | ゲームデザイン | `/design-gdd` |
| `architecture.md` | 技術構成 | 手動 |
| `decisions.md` | 意思決定ログ | 手動 |
| `bugs/` | バグレポート | `/qa-review` |
| `translations/` | 翻訳状況 | `/i18n-check` |
| `sounds-credits.md` | サウンドクレジット | `/sound-design` |
| `assets-credits.md` | アセットクレジット | `/asset-design` |
| `description-ja.md` | 日本語説明文 | `/write-description` |
| `description-en.md` | 英語説明文 | `/write-description` |

## エージェント構成

| エージェント | 役割 | Skills |
|-------------|------|--------|
| Orchestrator | 統括 | Claude Code本体 |
| Designer | 設計 | `/design-gdd`, `/asset-design` |
| Developer | 実装 | Subagent |
| QA | 品質 | `/qa-review` |
| Localization | 国際化 | `/i18n-check`, `/translate` |
| Sound | サウンド | `/sound-design` |
| Writer | テキスト | `/write-description` |
| DevOps | リリース | `/init-project`, `/release` |

## ファイル構成

```
.claude/
├── commands/
│   ├── init-project.md
│   ├── design-gdd.md
│   ├── asset-design.md      # NEW
│   ├── sound-design.md      # NEW
│   ├── write-description.md # NEW
│   ├── qa-review.md
│   ├── i18n-check.md
│   ├── translate.md
│   └── release.md
├── scripts/
├── settings.json
├── settings.local.json
└── README.md
```
