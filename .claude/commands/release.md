# Release - リリース準備（itch.io対応）

あなたはDevOps Agentとして、ゲームのリリース準備を実行します。

## バージョン

$ARGUMENTS（例: v1.0.0, patch, minor, major）

- `patch`: バグ修正 (0.0.X)
- `minor`: 機能追加 (0.X.0)
- `major`: 破壊的変更 (X.0.0)
- `vX.Y.Z`: 直接指定

## リリースチェックリスト

### 1. 品質ゲート確認

以下を実行・確認してください：

```bash
npm run build
npm run lint
npm run typecheck  # あれば
```

全てパスしない場合はリリースを中止。

### 2. 未解決バグ確認

`.project_memory/bugs/open/` を確認：
- Critical: 0件（必須）
- High: 0件（推奨）

### 3. 翻訳完了確認

- `/i18n-check` でエラーがないこと
- 全言語の翻訳が完了していること

### 4. バージョン更新

`package.json` のバージョンを更新：

```json
{
  "version": "X.Y.Z"
}
```

### 5. itch.io用ビルド設定

#### vite.config.js の確認・更新

itch.ioは相対パスが必要。`vite.config.js` に以下を追加：

```javascript
export default defineConfig({
  plugins: [react()],
  base: './',  // ← 相対パス（itch.io用）
})
```

### 6. ビルド実行

```bash
npm run build
```

`dist/` フォルダが生成されることを確認。

### 7. itch.io用ZIP作成

```bash
cd dist
zip -r ../[project-name]-v[X.Y.Z].zip .
cd ..
```

**重要**: `dist/` の中身をzipすること（`dist/` フォルダ自体ではない）

### 8. リリースノート作成

`.project_memory/releases/vX.Y.Z.md` を作成：

```markdown
# Release vX.Y.Z

**リリース日**: YYYY-MM-DD
**itch.io**: https://[username].itch.io/[game-name]

## 新機能
- [新機能の説明]

## 改善
- [改善点]

## バグ修正
- [修正したバグ]

## 既知の問題
- [あれば記載]
```

### 9. Git操作

```bash
git add -A
git commit -m "Release vX.Y.Z"
git tag vX.Y.Z
git push origin main --tags  # ユーザー確認後
```

### 10. itch.ioアップロード

#### 方法A: 手動アップロード（推奨）

1. https://itch.io/game/new または既存プロジェクトのEdit画面へ
2. 「Uploads」セクションで ZIP ファイルをアップロード
3. 「This file will be played in the browser」にチェック
4. Embed options:
   - 推奨サイズ: 800x600 または 960x540
   - Mobile friendly: 対応している場合はチェック
5. Save & Publish

#### 方法B: butler（CLI）を使用

```bash
# butlerインストール（初回のみ）
# https://itch.io/docs/butler/

# ログイン（初回のみ）
butler login

# アップロード
butler push dist/ [username]/[game-name]:html5

# バージョン指定
butler push dist/ [username]/[game-name]:html5 --userversion X.Y.Z
```

### 11. itch.ioページ設定確認

- [ ] タイトル・説明文
- [ ] スクリーンショット（3枚以上推奨）
- [ ] カバー画像（630x500推奨）
- [ ] タグ設定
- [ ] 価格設定（無料 / 寄付可 / 有料）

## 出力

リリース完了後、以下を報告：

```markdown
## Release Complete

**バージョン**: vX.Y.Z
**日時**: YYYY-MM-DD HH:MM

### チェック結果
- [x] ビルド成功
- [x] Lint パス
- [x] 翻訳完了
- [x] バグ0件

### 成果物
- ZIP: [project-name]-vX.Y.Z.zip
- Git tag: vX.Y.Z
- リリースノート: .project_memory/releases/vX.Y.Z.md

### itch.io
- URL: https://[username].itch.io/[game-name]
- ステータス: アップロード済み / 公開待ち

### 次のステップ
- [ ] itch.ioでZIPをアップロード
- [ ] ページ設定を確認
- [ ] 公開（Publish）
```

## itch.ioトラブルシューティング

### 画面が真っ白
- `vite.config.js` の `base: './'` を確認
- ブラウザコンソールでエラー確認

### アセットが読み込めない
- パスが絶対パス（`/assets/...`）になっていないか確認
- `base: './'` で相対パスに変換される

### iframe内で動かない
- `X-Frame-Options` ヘッダーの問題（通常はitch.ioが対応）

### モバイルで表示がおかしい
- viewport meta タグの確認
- タッチイベント対応の確認

## リリース後

リリース完了後：
1. itch.ioページでプレビュー動作確認
2. SNS投稿文を `/write-description SNS` で生成
3. プレイヤーフィードバックを収集
4. `knowledge/` に今回のプロジェクトの学びを追記

## 注意事項

- **git push** はユーザーの明示的な許可後にのみ実行
- itch.ioアップロードは手動で行うことを推奨
- 公開前にプレビューで動作確認
