# 技術アーキテクチャ

> このファイルはDeveloper Agentによって更新されます。
> プロジェクトの技術的な構造を記録します。

## 1. ディレクトリ構造

```
project-root/
├── src/
│   ├── components/     # Reactコンポーネント
│   ├── game/           # ゲームロジックモジュール
│   ├── i18n/           # 国際化
│   │   └── locales/    # 言語ファイル
│   ├── hooks/          # カスタムフック
│   ├── utils/          # ユーティリティ
│   ├── App.jsx         # アプリケーションルート
│   ├── Game.jsx        # メインゲームコンポーネント
│   └── main.jsx        # エントリーポイント
├── public/             # 静的アセット
├── project_memory/     # プロジェクトメモリ
└── .claude/            # Claude Code設定
```

## 2. 主要コンポーネント

### 2.1 Game.jsx
メインのゲームコンポーネント。

**責務**:
- ゲームステート管理
- ゲームループ制御
- レンダリング

**注意**: 肥大化を避けるため、機能は `src/game/` に分離すること。

### 2.2 ゲームロジックモジュール

| モジュール | 責務 |
|-----------|------|
| `game/xxx.js` | [説明] |

## 3. 状態管理

### 3.1 ゲームステート
```javascript
{
  gameState: 'title' | 'playing' | 'paused' | 'gameover',
  score: number,
  player: { ... },
  enemies: [ ... ],
  // ...
}
```

### 3.2 永続化
- localStorage使用箇所:
  - ハイスコア
  - 設定
  - 言語設定

## 4. 外部依存

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| react | ^18.x | UIフレームワーク |
| vite | ^6.x | ビルドツール |
| tailwindcss | ^4.x | スタイリング |
| i18next | ^23.x | 国際化 |
| react-i18next | ^14.x | React用i18nバインディング |

## 5. ビルド・デプロイ

### 5.1 開発
```bash
npm run dev
```

### 5.2 本番ビルド
```bash
npm run build
```

### 5.3 デプロイ先
- [ ] GitHub Pages
- [ ] itch.io
- [ ] Vercel
- [ ] その他

## 6. 設計原則

### 6.1 ファイルサイズ上限
- 単一ファイル: 500行を目安（超える場合は分割検討）
- コンポーネント: 300行を目安

### 6.2 命名規則
- コンポーネント: PascalCase (`GameOverScreen.jsx`)
- モジュール: camelCase (`gameLogic.js`)
- 定数: UPPER_SNAKE_CASE (`MAX_ENEMIES`)
- 翻訳キー: dot.notation (`game.over.title`)

### 6.3 コメント
- 複雑なロジックのみコメント追加
- JSDocは公開APIにのみ

---

## 更新履歴

| 日付 | 変更内容 |
|------|---------|
| YYYY-MM-DD | 初版作成 |
