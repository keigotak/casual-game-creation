# Knowledge Base

プロジェクト横断で蓄積される知見を管理するディレクトリです。

## ファイル

| ファイル | 内容 |
|---------|------|
| [patterns.md](patterns.md) | 効果的だったパターン（設計・実装・UI・ユーザー獲得） |
| [pitfalls.md](pitfalls.md) | 避けるべき落とし穴（コード・i18n・パフォーマンス・デザイン） |
| `reusable-code/` | 再利用可能なコードスニペット |

## 再利用可能コード一覧

| ファイル | 説明 | 用途 |
|---------|------|------|
| `seeded-random.js` | シード付き乱数生成器 | デイリーチャレンジ |
| `storage.js` | localStorage ラッパー | データ永続化 |
| `use-game-loop.js` | ゲームループ React Hook | 60fps/固定FPSループ |
| `sound-manager.js` | Web Audio API サウンドマネージャー | SE・BGM再生 |
| `fps-monitor.js` | FPSモニター | パフォーマンス計測 |
| `analytics.js` | 簡易アナリティクス | プレイヤー行動トラッキング |

## 更新タイミング

- プロジェクト完了時にレトロスペクティブとして追記
- 新しいパターンを発見したとき
- バグや問題に遭遇して解決したとき

## 活用方法

1. **新規プロジェクト開始時**: `patterns.md` を参照して設計
2. **問題発生時**: `pitfalls.md` で類似事例を検索
3. **コード実装時**: `reusable-code/` から流用（`/init-project` のステップ15参照）
