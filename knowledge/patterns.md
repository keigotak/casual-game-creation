# 効果的なパターン集

> プロジェクト横断で学んだ効果的なパターンを記録します。
> 新しいプロジェクトを始める際の参考にしてください。

## 設計パターン

### プレイヤーファンタジーの明確化
ゲームで最も重要なのは、プレイヤーが「自分は何者になれるのか」を瞬時に想像できること。タイトル画面・最初の3秒で役割が伝わらなければ、プレイヤーはゲームに入り込めない。

**チェックポイント**:
- 画面を見た瞬間に「自分は〇〇だ」と分かるか
- キャラクター・世界観・状況が視覚的に伝わるか
- 1行コンセプトに「プレイヤーが何者か」が含まれているか

**良い例**:
- 「草食恐竜となり、肉食恐竜の群れから生き延びろ！」→ 即座に役割と状況が分かる
- 「最後の消防士として、炎に包まれた街を救え」→ ヒーローになれるイメージが湧く

**悪い例**:
- 「障害物を避けてスコアを稼ぐゲーム」→ メカニクスの説明であり、ファンタジーがない
- 「ボールを転がすゲーム」→ 何者にもなれない

**学んだこと**: コアループやメカニクスの前に、まず「プレイヤーファンタジー」を設計する。ファンタジーが明確なら、メカニクスもUIもフックも自然に方向が定まる。

### ゲームステート管理
```javascript
const GAME_STATES = {
  TITLE: 'title',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
};

const [gameState, setGameState] = useState(GAME_STATES.TITLE);
```
**学んだこと**: 文字列直接よりenum的オブジェクトで型安全に。

### シードベース乱数（デイリーチャレンジ用）
```javascript
// SeededRandom - 同じシードで同じ結果を保証
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  next() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
}

// 日付からシード生成
function dateToSeed(date) {
  return date.getFullYear() * 10000 +
         (date.getMonth() + 1) * 100 +
         date.getDate();
}
```
**使用例**: Dinosaviverのデイリーテーマ。LCGの初期偏りを回避するため10回空回し。

### データ駆動設計
```javascript
// ハードコードを避け、データオブジェクトで定義
const ENEMIES = {
  compy: { hp: 10, speed: 3, points: 5 },
  raptor: { hp: 30, speed: 2, points: 15 },
};
```
**メリット**: 新しい敵の追加が容易、バランス調整が一箇所で完結

### 難易度曲線のパラメータ化
```javascript
const DIFFICULTY = {
  speed: { initial: 2, max: 8, increaseRate: 0.1 },
  spawnRate: { initial: 2000, min: 500, decreaseRate: 50 },
};

// 時間に応じた難易度計算
function getDifficulty(elapsed) {
  return {
    speed: Math.min(DIFFICULTY.speed.initial + elapsed * DIFFICULTY.speed.increaseRate, DIFFICULTY.speed.max),
    spawnRate: Math.max(DIFFICULTY.spawnRate.initial - elapsed * DIFFICULTY.spawnRate.decreaseRate, DIFFICULTY.spawnRate.min),
  };
}
```
**学んだこと**: 難易度はハードコードせず、曲線をパラメータで制御する。

### 重み付き選択（バリエーション生成）
```javascript
// テーマごとに異なるボス出現率
weightedChoice(theme.bossWeights, rng);
```
**使用例**: Dinosaviverのデイリーテーマ。テーマごとの個性化に有効。

---

## 実装パターン

### モジュール分離の基準
- **500行超えたら分割を検討**
- ゲームロジックは `src/game/` に分離
- UIコンポーネントは `src/components/` に分離
- 定数は `src/game/config.js` に集約

### i18n実装
```javascript
// 早期から翻訳キーを使用
<button>{t('title.start')}</button>

// 補間パラメータ
<span>{t('game.score', { score })}</span>
```
**教訓**: 後から翻訳対応は大変。最初から `t()` を使う。

### localStorage永続化
```javascript
// 抽象化して一元管理
const loadData = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};
```
**教訓**: localStorageは壊れる前提でフォールバック必須。

### Web Audio API サウンド管理
```javascript
// AudioContextベース（低レイテンシ）
// new Audio() は避ける → モバイルで遅延・再生失敗
soundManager.init(); // ユーザー操作後に初期化
soundManager.playSE('click'); // バッファ再生で低遅延
```
**教訓**: `new Audio()` はモバイルで問題多い。Web Audio APIを使う。

---

## UIパターン

### レスポンシブゲーム画面
```css
/* モバイルファースト */
.game-container {
  @apply w-full max-w-md mx-auto p-4;
}

/* デスクトップ */
@media (min-width: 768px) {
  .game-container {
    @apply max-w-2xl;
  }
}
```

### タッチ/クリック両対応
```javascript
// onPointerDown を使用（タッチ・マウス両対応）
<button onPointerDown={handleAction}>
```

### フィードバック設計
| イベント | 視覚 | 聴覚 |
|---------|------|------|
| スコア獲得 | テキストポップ + 色変化 | チャリン音 |
| ダメージ | 画面フラッシュ(赤) | ヒット音 |
| ゲームオーバー | スローモーション | 低音SE |
| ハイスコア更新 | パーティクル演出 | ファンファーレ |

**教訓**: 全てのプレイヤーアクションに視覚+聴覚のフィードバックを。無音ゲームでも視覚だけで伝わるようにする。

---

## ユーザー獲得パターン

### 初回体験の黄金律
1. **3秒**: 画面を見てゲームの種類が分かる
2. **10秒**: 操作方法が分かり、最初の成功体験がある
3. **30秒**: ゲームオーバーを経験し、「もう1回」と思う

### リテンション要素の優先順位
1. ハイスコア記録（実装コスト低、効果高）
2. 1タップリトライ（摩擦を最小に）
3. デイリーチャレンジ（シード乱数で実装）
4. アンロック要素（長期モチベーション）
5. オンラインランキング（ソーシャル競争）

### itch.ioで見つけてもらうコツ
- カバー画像(630x500)は最も重要なマーケティング素材
- タグを10個以上つける
- 日本語+英語の両方で説明文を書く
- GIFスクリーンショットが静止画より効果的

---

## 追加履歴

| 日付 | パターン | 出典プロジェクト |
|------|---------|----------------|
| 2026-02-05 | 初期パターン集 | IGNITION, Dinosaviver |
| 2026-02-06 | 難易度曲線, フィードバック設計, ユーザー獲得 | システムレビュー |
