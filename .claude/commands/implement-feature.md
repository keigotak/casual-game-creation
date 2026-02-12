# Implement Feature - 機能実装

あなたはDeveloper Agentとして、GDDに基づいてゲーム機能を実装します。

## 対象

$ARGUMENTS（実装する機能名やGDDセクション。例: コア移動、スコアシステム、敵生成）

## 実装手順

### 1. 仕様確認

以下を読んで実装仕様を把握：
- `.project_memory/gdd.md` - 該当機能の仕様
- `.project_memory/architecture.md` - 技術アーキテクチャ
- `src/game/config.js` - 既存の設定値
- 関連する既存コード

### 2. 実装計画

実装前に計画を立てる：

```markdown
### 実装計画: [機能名]

**変更ファイル**:
- `src/game/[module].js` - [変更内容]
- `src/Game.jsx` - [変更内容]

**新規ファイル**:
- `src/game/[module].js` - [概要]

**依存関係**:
- [必要なライブラリや既存モジュール]

**テスト方針**:
- [テストすべき項目]
```

### 3. 実装原則

#### コード構造
- ゲームロジックは `src/game/` に分離（UIコンポーネントに埋め込まない）
- 1ファイル500行以内。超えそうなら分割
- 定数は `src/game/config.js` に集約
- マジックナンバー禁止

#### i18n
- 全てのユーザー向けテキストは `t('key')` を使用
- 新しいキーは `ja.json` と `en.json` の両方に追加

#### パフォーマンス
- `useCallback` / `useMemo` を適切に使用
- ゲームループ内でオブジェクト生成を最小化
- Canvas描画の場合、不要な再描画を避ける

#### アクセシビリティ
- ボタンは最低44x44pxのタッチターゲット
- `onPointerDown` でタッチ/マウス両対応
- キーボードとタッチの両方で操作可能

### 4. 実装

計画に基づいてコードを書く。

### 5. 動作確認

```bash
# ビルドが通ることを確認
npm run build

# テストが通ることを確認
npm run test:run

# 開発サーバーで動作確認
npm run dev
```

### 6. テスト追加

実装した機能のテストを `src/test/` に追加：

```javascript
// src/test/[module].test.js
import { describe, it, expect } from 'vitest';

describe('[Module]', () => {
  it('should [expected behavior]', () => {
    // テストコード
  });
});
```

ゲームロジック（`src/game/` 内の純粋関数）は特にテストを書く。

### 7. i18nキー追加確認

新しいテキストを追加した場合：
- `src/i18n/locales/ja.json` に日本語キーを追加
- `src/i18n/locales/en.json` に英語キーを追加

## 出力

```markdown
## Feature Implementation Complete

**機能**: [機能名]
**日時**: YYYY-MM-DD

### 変更ファイル
| ファイル | 変更内容 |
|---------|---------|
| src/game/xxx.js | [概要] |

### 新規ファイル
| ファイル | 概要 |
|---------|------|
| src/game/xxx.js | [概要] |

### 追加した翻訳キー
| キー | ja | en |
|-----|----|----|
| xxx | xxx | xxx |

### テスト
- [x] ビルド成功
- [x] テスト追加・パス
- [ ] 開発サーバーで動作確認（ユーザーに確認依頼）

### 次のステップ
1. `npm run dev` で動作を確認
2. 問題があれば `/fix-bugs` で修正
3. 次の機能を `/implement-feature [次の機能]` で実装
4. 全機能実装後は `/playtest-review` で体験チェック
```

## 注意事項

- GDDの仕様から逸脱する場合は必ずユーザーに確認
- 大きな設計変更が必要な場合は `/design-gdd update` を先に実行
- 既存機能を壊さないよう注意（テストで確認）
- コミットはユーザーに任せる（自動コミットしない）
