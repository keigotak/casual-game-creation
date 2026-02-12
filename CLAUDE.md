# Game Dev Agent System

マルチエージェントによるWebゲーム開発システム。Claude Codeの機能を活用して効率的なゲーム開発ワークフローを提供する。

## システム構成

```
.
├── .claude/commands/     # Skills（カスタムコマンド）
├── projects/             # ゲームプロジェクト群（各 git submodule）
├── shared/templates/     # プロジェクトテンプレート
└── knowledge/            # 横断的な知見・再利用コード
```

## 使用可能なSkills

| コマンド | 用途 |
|---------|------|
| `/init-project <name>` | `projects/` に新規ゲーム作成（Tailwind v4 + vitest） |
| `/design-gdd <concept>` | GDD作成・更新（コアループ・初回体験・リテンション設計） |
| `/implement-feature <feature>` | GDDに基づく機能実装 |
| `/fix-bugs [id\|all]` | バグレポートに基づく修正 |
| `/playtest-review` | プレイテスト観点UXレビュー |
| `/qa-review` | 品質レビュー・バグ検出（ビルド検証含む） |
| `/i18n-check` | 翻訳漏れチェック |
| `/translate <lang>` | 翻訳実行 |
| `/asset-design` | アイコン・UI素材・ビジュアルアセット設計 |
| `/sound-design` | 効果音・BGM設計・管理（Web Audio API対応） |
| `/write-description` | itch.io説明文・README作成 |
| `/release <version>` | リリース準備（itch.io対応） |

## 開発ワークフロー

```
/init-project → /design-gdd → /implement-feature(繰り返し) →
/playtest-review → /qa-review → /fix-bugs →
/i18n-check → /translate → /asset-design → /sound-design →
/write-description → /release
```

各Skillの出力に「次のステップ」が記載されているので、それに従って進める。

## プロジェクト構造

各ゲームは `projects/<name>/` に作成され、以下を含む：
- `src/` - ソースコード（React + Vite + Tailwind v4 + i18next + vitest）
- `src/game/` - ゲームロジック（UIから分離）
- `src/game/config.js` - ゲーム設定定数
- `src/test/` - テスト
- `.project_memory/` - プロジェクト固有のGDD、バグ、翻訳状況、クレジット

## 再利用可能コード

`knowledge/reusable-code/` に以下が利用可能：
- `seeded-random.js` - デイリーチャレンジ用シード乱数
- `storage.js` - localStorage ラッパー
- `use-game-loop.js` - ゲームループ React Hook
- `sound-manager.js` - Web Audio API サウンドマネージャー
- `fps-monitor.js` - FPS計測ツール
- `analytics.js` - 簡易プレイヤー行動トラッキング

## itch.ioリリース

### 必須設定
`vite.config.js` で相対パスを指定：
```javascript
export default defineConfig({
  base: './',  // itch.io用
})
```

### ビルド＆ZIP
```bash
./itch-build.sh 1.0.0
```

### アップロード手順
1. itch.io でゲームページを作成/編集
2. ZIPをアップロード
3. 「This file will be played in the browser」にチェック
4. 埋め込みサイズ設定（800x600推奨）
5. 公開

## 知見の管理

- `knowledge/patterns.md` - 効果的だったパターン（設計・実装・UI・ユーザー獲得）
- `knowledge/pitfalls.md` - 避けるべき落とし穴（コード・i18n・パフォーマンス・デザイン）
- `knowledge/reusable-code/` - 再利用可能コード

## 重要な規約

- **センシティブ情報（アカウント名・メールアドレス・認証情報等）はコミットに含めない**
- ゲームロジックは `src/game/` に分離
- 定数は `src/game/config.js` に集約（マジックナンバー禁止）
- 全テキストは最初から `t('key')` で国際化
- 500行超えたらファイル分割を検討
- ゲームロジックの純粋関数にはテストを書く
- プロジェクト完了時は `knowledge/` に学びを追記
- サウンド・アセットのライセンスは `.project_memory/` に記録
- サウンドは Web Audio API (`sound-manager.js`) を使用

## 技術スタック

React 19 / Vite 7 / Tailwind CSS 4 / i18next / vitest
