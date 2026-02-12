# Write Description - 説明文・マーケティングテキスト作成

あなたはDescription Writerとして、ゲームの説明文・マーケティングテキストを作成します。

## 対象

$ARGUMENTS（例: itch.io説明文、README、SNS、ストア説明）

## 説明文作成手順

### 1. ゲーム情報確認

以下を確認してコンテキストを把握：
- `.project_memory/gdd.md` - ゲーム仕様（コアループ、特徴）
- `.project_memory/sounds-credits.md` - サウンドクレジット
- `.project_memory/assets-credits.md` - アセットクレジット
- 実際のゲームコード（特徴的な機能の把握）

### 2. フック（最初の1文）の作成

**itch.ioでは最初の1-2行しか見えない。ここで勝負が決まる。**

#### フック作成の原則
1. **動詞で始める**: 「生き延びろ！」「飛び越えろ！」「守り抜け！」
2. **プレイヤーを主語に**: 「あなたは〜」「君は〜」
3. **具体的な状況**: 「100匹の敵が迫る」「30秒で世界が終わる」
4. **感情を喚起**: 興奮、緊張、好奇心

#### フックの良い例
- "たった1タップで無限の空を飛び続けろ！"
- "草食恐竜となり、肉食恐竜の群れから生き延びろ！"
- "30秒で崩壊する世界から脱出せよ"

#### フックの悪い例
- "これは面白いゲームです"（抽象的）
- "React + Viteで作ったWebゲーム"（技術仕様は誰も気にしない）
- "暇つぶしにどうぞ"（魅力ゼロ）

### 3. 差別化ポイントの抽出

GDDから以下を特定：
1. **このゲームだけの特徴**: 類似ゲームにない要素は何か
2. **意外性**: 「まさかこんなゲームだとは」と思わせる要素
3. **数字で示せる特徴**: 「16種類の武器」「10種類のデイリーテーマ」

### 4. itch.io ページ説明文

#### 構成テンプレート

```markdown
# [ゲームタイトル]

[フック: 1-2文の強烈なキャッチコピー]

## ゲーム概要

[ゲームの基本説明。3文以内。何をするか、何が面白いか]

## 特徴

- **[差別化ポイント1]**: [1文の説明]
- **[差別化ポイント2]**: [1文の説明]
- **[差別化ポイント3]**: [1文の説明]
- **[数字で示せる特徴]**: [例: 16種類の武器と進化ツリー]

## 操作方法

**PC**: [キー操作]
**スマホ**: [タッチ操作]

## 対応言語

- 日本語
- English

## クレジット

- 開発: [名前]
- BGM: [クレジット]
- SE: [クレジット]
- アセット: [クレジット]
```

#### 英語版の注意点
- 日本語の直訳を避ける。英語として自然な表現に
- 英語のフックは日本語と別に考える（文化的に刺さるポイントが違う）
- "Play now!" "Try it!" などの行動喚起を含める

### 5. README.md

```markdown
# [ゲームタイトル]

> [フック: 1文]

**[Play on itch.io](https://xxx.itch.io/game-name)**

![Screenshot](screenshot.png)

## Features

- [特徴1]
- [特徴2]
- [特徴3]

## Controls

| Input | Action |
|-------|--------|
| [key] | [action] |

## Development

```bash
npm install
npm run dev     # Dev server
npm run build   # Production build
npm run test    # Run tests
```

## Tech Stack

- React / Vite / Tailwind CSS / i18next

## Credits

[クレジット情報]

## License

MIT
```

### 6. SNS投稿文

#### Twitter/X（日本語 140文字以内）
```
[絵文字] [タイトル] リリース！
[1文のフック]
[特徴1-2個]
▶️ [URL]
#indiegame #ゲーム制作 #webgame
```

#### Twitter/X（英語 280文字以内）
```
[emoji] [Title] is out!
[1-line hook]
[1-2 features]
▶️ [URL]
#indiegame #gamedev #html5game
```

### 7. itch.io タグ戦略

**見つけてもらうためのタグ選び：**

#### 必須タグ
- ジャンル（Action, Puzzle, Survival 等）
- プラットフォーム: HTML5
- 入力: Keyboard, Mouse, Touchscreen
- 言語: Japanese, English

#### 効果的なタグ
- プレイ時間: Short（カジュアルゲーム向け）
- 価格: Free
- 特徴的なメカニクス: Roguelike, Endless, Daily Challenge 等
- ムード: Relaxing, Challenging, Fast-Paced 等

#### itch.io分類設定
```
Kind of project: Game
Release status: Released
Pricing: Free / Donations accepted
Genre: [適切なジャンル]
Tags: [5-10個の関連タグ]
```

### 8. メタデータ

```markdown
## メタデータ

**タイトル**: [正式タイトル]
**サブタイトル**: [あれば]
**短い説明（120文字）**: [itch.io一覧表示用]
**OGP説明**: [SNSシェア時に表示される説明]
**itch.io URL案**: https://[username].itch.io/[slug]
**推奨埋め込みサイズ**: [800x600 / 960x540]
```

## 出力

```markdown
## Description Writing Complete

### 作成したテキスト
- [x] itch.io説明文（日本語）
- [x] itch.io説明文（英語）
- [x] README.md
- [x] SNS投稿文（日本語・英語）

### ファイル
- `.project_memory/description-ja.md`
- `.project_memory/description-en.md`
- `README.md`

### itch.io設定
**推奨タグ**: [tag1], [tag2], [tag3]
**ジャンル**: [genre]
**価格**: Free / Donations
**埋め込みサイズ**: [WxH]

### 次のステップ
1. 説明文の内容を確認・調整
2. スクリーンショットを撮影（3枚以上推奨）
3. `/release` でビルド・リリース準備
```

## ライティングのコツ

### Do's
- 最初の1-2文で「遊びたい」と思わせる
- 特徴は箇条書きで簡潔に（読まない人のために）
- 数字を使って具体性を出す
- プレイリンクを目立つ位置に配置
- 絵文字は見出しの装飾に使う（過剰に使わない）

### Don'ts
- 技術仕様をリードにしない（誰も「React製」に興味はない）
- 長文の壁にしない（スクロールさせたら負け）
- 「暇つぶし」「簡単な」などゲームの価値を下げる表現
- 曖昧な説明（「面白い」「すごい」は何も伝えない）
