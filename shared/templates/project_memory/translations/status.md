# 翻訳ステータス

> Localization Agentが更新します。
> 各言語の翻訳進捗を追跡します。

## 対応言語

| 言語 | コード | ステータス | 進捗 |
|------|--------|-----------|------|
| 日本語 | ja | Primary | - |
| English | en | - | - |

## 翻訳キー統計

| 指標 | 値 |
|------|-----|
| 総キー数 | - |
| ja 翻訳済み | - |
| en 翻訳済み | - |

## 最新チェック

**日時**: -
**結果**: -

### 問題

なし

## 翻訳ガイドライン

### 1. キー命名規則
```
{画面}.{要素}.{詳細}

例:
- title.start_button
- game.score.label
- gameover.retry_button
- settings.language.label
```

### 2. 補間パラメータ
```javascript
// キー定義
"score_display": "スコア: {{score}}点"

// 使用
t('score_display', { score: 100 })
```

### 3. 複数形（英語）
```javascript
// キー定義
"enemy_count": "{{count}} enemy"
"enemy_count_plural": "{{count}} enemies"
```

### 4. 注意事項
- UIに表示される全テキストは翻訳キー化すること
- console.log等のデバッグ用テキストは除外
- 数値フォーマットは言語ごとに考慮

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| - | - |
