# ゲーム開発エージェントシステム設計書

## 1. システム概要

### 1.1 目的
人間の開発者とAIエージェントが協調してゲームを開発するためのマルチエージェントシステム。
IGNITIONの開発プロセスをメタ化し、再現可能なゲーム開発ワークフローを実現する。

### 1.2 基本コンセプト
```
[Human Director] ←→ [Orchestrator Agent] ←→ [Specialist Agents]
                              ↓
                    [Shared Context/Memory]
```

### 1.3 開発フェーズ（IGNITIONから抽出）
1. **企画フェーズ** - GDD作成、コンセプト定義
2. **実装フェーズ** - コア機能開発
3. **レビューフェーズ** - 品質確認、バグ発見
4. **修正フェーズ** - バグ修正、機能改善
5. **国際化フェーズ** - 多言語対応
6. **リリースフェーズ** - ドキュメント作成、デプロイ

---

## 2. エージェントアーキテクチャ

### 2.1 エージェント階層

```
┌─────────────────────────────────────────────────────────────┐
│                    Human Director                           │
│                  （人間の意思決定者）                          │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  Orchestrator Agent                         │
│              （オーケストレーター）                            │
│  - タスク分解・割り当て                                        │
│  - 進捗管理                                                  │
│  - エージェント間調整                                         │
│  - 品質ゲート管理                                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼───────┐ ┌───────▼───────┐ ┌───────▼───────┐
│  Designer     │ │  Developer    │ │  QA Agent     │
│  Agent        │ │  Agent        │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
        │                 │                 │
┌───────▼───────┐ ┌───────▼───────┐ ┌───────▼───────┐
│  Writer       │ │  DevOps       │ │  Localization │
│  Agent        │ │  Agent        │ │  Agent        │
└───────────────┘ └───────────────┘ └───────────────┘
```

### 2.2 エージェント定義

#### 2.2.1 Orchestrator Agent（オーケストレーター）
```yaml
role: プロジェクト全体の統括
responsibilities:
  - ユーザー要求の解釈とタスク分解
  - 適切なエージェントへのタスク割り当て
  - 進捗監視と品質管理
  - エージェント間のコンフリクト解決
  - 人間へのエスカレーション判断
capabilities:
  - タスク管理 (TodoWrite相当)
  - エージェント呼び出し (Task相当)
  - 意思決定質問 (AskUserQuestion相当)
```

#### 2.2.2 Designer Agent（デザイナー）
```yaml
role: ゲームデザイン・UI/UX設計
responsibilities:
  - GDD（ゲームデザインドキュメント）作成・更新
  - UI/UXフロー設計
  - ゲームバランス設計
  - プレイヤー体験設計
inputs:
  - コンセプト要件
  - ユーザーフィードバック
outputs:
  - GDD
  - UIワイヤーフレーム（テキスト形式）
  - バランスパラメータ定義
```

#### 2.2.3 Developer Agent（開発者）
```yaml
role: コード実装
responsibilities:
  - 機能実装
  - バグ修正
  - コードリファクタリング
  - パフォーマンス最適化
capabilities:
  - ファイル読み書き (Read, Write, Edit)
  - コード検索 (Glob, Grep)
  - コマンド実行 (Bash)
sub_specialists:
  - Frontend Developer
  - Game Logic Developer
  - Animation Developer
```

#### 2.2.4 QA Agent（品質保証）
```yaml
role: 品質検証
responsibilities:
  - 機能テスト
  - バグ発見・報告
  - レグレッションチェック
  - クロスブラウザ/デバイス確認
inputs:
  - 実装済み機能
  - テスト仕様
outputs:
  - バグレポート（構造化）
  - テスト結果サマリー
```

#### 2.2.5 Localization Agent（ローカライズ）
```yaml
role: 多言語対応
responsibilities:
  - 翻訳キー抽出
  - 翻訳実行
  - 翻訳漏れチェック
  - 文化的適応
capabilities:
  - 言語ファイル解析
  - 翻訳パターン検出
  - 一貫性チェック
```

#### 2.2.6 DevOps Agent
```yaml
role: 開発環境・デプロイ管理
responsibilities:
  - ビルド実行
  - リポジトリ管理
  - デプロイ自動化
  - ドキュメント生成
capabilities:
  - Git操作
  - CI/CD設定
  - 静的サイトデプロイ
```

#### 2.2.7 Writer Agent（ライター）
```yaml
role: テキストコンテンツ作成
responsibilities:
  - ゲーム内テキスト作成
  - ストーリー・ダイアログ執筆
  - ドキュメント作成
outputs:
  - ゲーム内テキスト
  - README/ドキュメント
```

---

## 3. ワークフロー設計

### 3.1 基本ワークフロー

```
┌──────────────────────────────────────────────────────────────┐
│                        INPUT                                 │
│  - ユーザー要求 (自然言語)                                     │
│  - GDD (オプション)                                           │
│  - 既存コードベース (オプション)                                │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 1: 理解・計画                         │
│  Orchestrator:                                               │
│    1. 要求解析                                               │
│    2. 必要エージェント特定                                     │
│    3. タスク分解・依存関係定義                                  │
│    4. 実行計画作成                                            │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 2: 設計                              │
│  Designer Agent:                                             │
│    1. GDD作成/更新                                           │
│    2. 機能仕様定義                                            │
│    3. UI/UX設計                                              │
│                                                              │
│  Human Review Gate ◆───── 承認待ち                           │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 3: 実装                              │
│  Developer Agent:                                            │
│    1. コア機能実装                                            │
│    2. UI実装                                                 │
│    3. ゲームロジック実装                                       │
│                                                              │
│  並列: Writer Agent → ゲーム内テキスト作成                      │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 4: 品質保証                           │
│  QA Agent:                                                   │
│    1. 機能テスト実行                                          │
│    2. バグレポート作成                                        │
│    3. 修正依頼 → Developer Agent                              │
│                                                              │
│  Loop until: バグ0 or Human決定                              │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 5: 国際化                             │
│  Localization Agent:                                         │
│    1. 翻訳キー抽出                                            │
│    2. 翻訳実行                                                │
│    3. 翻訳検証                                                │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   PHASE 6: リリース                           │
│  DevOps Agent:                                               │
│    1. ビルド実行                                              │
│    2. ドキュメント生成                                        │
│    3. リポジトリ整備                                          │
│    4. デプロイ                                                │
│                                                              │
│  Human Review Gate ◆───── 最終承認                           │
└─────────────────────────┬────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                        OUTPUT                                │
│  - デプロイ済みゲーム                                         │
│  - ソースコード（リポジトリ）                                   │
│  - ドキュメント                                               │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 IGNITIONでの実際のフロー（参考）

```
Human: "全体見渡してまだ機能確認したほうがいいところはある？"
  │
  ▼
Orchestrator → QA Agent: レビュー実行
  │
  ├─ バグ発見: ゲームオーバーロジック
  ├─ バグ発見: スクロール問題
  ├─ バグ発見: 翻訳漏れ
  │
  ▼
Human: "修正します"
  │
  ▼
Orchestrator → Developer Agent: バグ修正
  │
  ├─ ゲームオーバー条件修正
  ├─ レイアウト修正
  │
  ▼
Orchestrator → Localization Agent: 翻訳修正
  │
  ├─ launchMsg翻訳追加
  ├─ control_lines翻訳追加
  ├─ DialogLine翻訳対応
  │
  ▼
Orchestrator → DevOps Agent: リリース
  │
  ├─ git commit
  ├─ gh repo create
  ├─ git push
  ├─ README作成
  │
  ▼
Complete
```

### 3.3 Dinosaviverでの実際の開発フロー（参考）

```
Human: "草食恐竜のサバイバルゲームを作りたい"
  │
  ▼
Phase 1: コア実装（Initial Commit）
  │
  Developer Agent:
  ├─ 基本的なプレイヤー移動
  ├─ 敵の生成とAI
  ├─ 武器システム（基本）
  ├─ XP/レベルアップシステム
  │
  ▼
Phase 2: 機能拡張（複数コミット）
  │
  Designer Agent → Developer Agent:
  ├─ ボスイベント設計 → 実装
  ├─ シナジーシステム設計 → 実装
  ├─ 実績システム設計 → 実装
  │
  ▼
Phase 3: UI/UX改善
  │
  Developer Agent:
  ├─ レスポンシブ対応
  ├─ ゲームオーバー画面改善
  ├─ ポーズ機能追加
  │
  ▼
Phase 4: コンテンツ拡充（大規模追加）
  │
  Designer Agent: デイリーシステム仕様作成
  Developer Agent:
  ├─ ボタンシステム実装 (buttonSystem.js)
  ├─ デイリーテーマ実装 (dailyThemes.js, dailySystem.js)
  ├─ リーダーボード実装 (leaderboard.js)
  ├─ テキストアップグレード実装 (textUpgrades.js)
  │
  ▼
Phase 5: 国際化（i18n）
  │
  Localization Agent:
  ├─ i18n基盤セットアップ
  ├─ 日本語翻訳ファイル作成 (ja.json: 416行)
  ├─ 英語翻訳ファイル作成 (en.json: 416行)
  ├─ ハードコード文字列の翻訳キー置換
  │
  ▼
Phase 6: 外部連携
  │
  Developer Agent:
  ├─ オンラインリーダーボード統合 (onlineLeaderboard.js)
  ├─ APIエラーハンドリング
  │
  ▼
Phase 7: 洗練・リリース準備
  │
  QA Agent:
  ├─ 全デイリーテーマの動作確認
  ├─ モバイル/デスクトップ両対応確認
  │
  Developer Agent:
  ├─ ウェーブシステム改善
  ├─ UI表示改善
  │
  DevOps Agent:
  ├─ README.md作成
  ├─ itch.ioビルドスクリプト
  │
  ▼
Complete（12コミット、2000行以上のゲームロジック）
```

**開発統計（Dinosaviver）**:
- 総コミット数: 12
- 主要ファイル: 11ファイル（src/game/*.js + Game.jsx + i18n）
- 翻訳キー数: 約200キー × 2言語
- ゲームコンテンツ: 敵5種、仲間11種、武器16種、テーマ10種

---

## 4. 共有コンテキスト設計

### 4.1 プロジェクトメモリ構造

```
project_memory/
├── gdd.md                    # ゲームデザインドキュメント
├── architecture.md           # 技術アーキテクチャ
├── decisions.md              # 意思決定ログ
├── bugs/                     # バグトラッキング
│   ├── open/
│   └── closed/
├── translations/             # 翻訳管理
│   ├── keys.json
│   └── status.md
└── releases/                 # リリース履歴
    └── v1.0.md
```

### 4.2 エージェント間メッセージ形式

```typescript
interface AgentMessage {
  from: AgentType;
  to: AgentType;
  type: 'task' | 'result' | 'question' | 'report';
  priority: 'low' | 'medium' | 'high' | 'critical';
  payload: {
    task?: TaskDefinition;
    result?: TaskResult;
    question?: Question;
    report?: Report;
  };
  context: {
    phase: Phase;
    relatedFiles: string[];
    previousMessages: string[];  // 参照用ID
  };
}
```

### 4.3 バグレポート形式

```typescript
interface BugReport {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'logic' | 'ui' | 'performance' | 'i18n' | 'ux';
  title: string;
  description: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  actualBehavior: string;
  affectedFiles: string[];
  suggestedFix?: string;
}
```

---

## 5. 品質ゲート定義

### 5.1 フェーズ移行条件

| From | To | 条件 |
|------|----|----|
| 設計 | 実装 | GDD承認、UI設計完了 |
| 実装 | QA | ビルド成功、基本機能動作 |
| QA | 国際化 | Critical/Highバグ0 |
| 国際化 | リリース | 全言語翻訳完了、翻訳レビュー完了 |
| リリース | 完了 | Human最終承認 |

### 5.2 自動チェック項目

```yaml
implementation_gate:
  - build_success: true
  - no_console_errors: true
  - responsive_check: [mobile, tablet, desktop]

qa_gate:
  - critical_bugs: 0
  - high_bugs: 0
  - test_coverage: "> 80%"

i18n_gate:
  - all_keys_translated: true
  - no_hardcoded_strings: true
  - rtl_support: conditional  # 対象言語がある場合

release_gate:
  - readme_exists: true
  - license_exists: true
  - version_tagged: true
```

---

## 6. 実装アーキテクチャ

### 6.1 技術スタック案

```yaml
runtime: Node.js / TypeScript
ai_backend: Claude API (claude-sonnet-4-20250514 or claude-opus-4-5-20251101)
agent_framework:
  option_a: Claude Agent SDK
  option_b: LangGraph
  option_c: Custom Implementation
storage:
  project_files: Local filesystem
  agent_memory: SQLite / JSON files
  conversation: JSONL logs
communication:
  human_interface: CLI (like Claude Code)
  agent_to_agent: Internal message queue
```

### 6.2 エージェント実装パターン

```typescript
interface Agent {
  name: string;
  role: string;
  systemPrompt: string;
  tools: Tool[];

  // Core methods
  processTask(task: Task): Promise<TaskResult>;
  askClarification(question: Question): Promise<Answer>;
  reportProgress(progress: Progress): void;

  // Memory
  getContext(): AgentContext;
  updateMemory(entry: MemoryEntry): void;
}

class DeveloperAgent implements Agent {
  tools = [Read, Write, Edit, Glob, Grep, Bash];

  async processTask(task: Task): Promise<TaskResult> {
    // 1. タスク理解
    // 2. 関連コード調査
    // 3. 実装計画
    // 4. 実装実行
    // 5. 自己検証
    // 6. 結果報告
  }
}
```

### 6.3 オーケストレーター実装

```typescript
class Orchestrator {
  private agents: Map<AgentType, Agent>;
  private taskQueue: PriorityQueue<Task>;
  private projectMemory: ProjectMemory;

  async processUserRequest(request: string): Promise<void> {
    // 1. 要求解析
    const analysis = await this.analyzeRequest(request);

    // 2. タスク分解
    const tasks = await this.decomposeTasks(analysis);

    // 3. 依存関係解決・スケジューリング
    const schedule = this.createSchedule(tasks);

    // 4. 実行
    for (const phase of schedule) {
      // 並列実行可能なタスクは並列に
      await Promise.all(
        phase.tasks.map(task => this.executeTask(task))
      );

      // 品質ゲートチェック
      if (!await this.checkQualityGate(phase)) {
        await this.handleGateFailure(phase);
      }
    }
  }

  private async executeTask(task: Task): Promise<TaskResult> {
    const agent = this.agents.get(task.assignedAgent);
    const result = await agent.processTask(task);

    // 結果に基づく追加タスク生成
    if (result.followUpTasks) {
      this.taskQueue.addAll(result.followUpTasks);
    }

    return result;
  }
}
```

---

## 7. 拡張性設計

### 7.1 プラグインアーキテクチャ

```typescript
interface AgentPlugin {
  name: string;
  version: string;
  agentType: AgentType;

  // Agent extension
  extendTools?(baseTools: Tool[]): Tool[];
  extendPrompt?(basePrompt: string): string;

  // Hooks
  onTaskStart?(task: Task): void;
  onTaskComplete?(task: Task, result: TaskResult): void;
  onError?(error: Error): ErrorHandling;
}

// 例: Unity対応プラグイン
const unityPlugin: AgentPlugin = {
  name: 'unity-support',
  version: '1.0.0',
  agentType: 'Developer',

  extendTools: (baseTools) => [
    ...baseTools,
    UnityEditorTool,
    UnityBuildTool,
  ],

  extendPrompt: (base) => `${base}\n\nUnity specific guidelines...`,
};
```

### 7.2 ゲームジャンル別テンプレート

```yaml
templates:
  casual_web_game:
    tech_stack: [React, Vite, TailwindCSS]
    agents: [Designer, Developer, QA, Localization, DevOps]
    phases: [design, implement, qa, i18n, release]

  mobile_game:
    tech_stack: [React Native, Expo]
    agents: [Designer, Developer, QA, Localization, DevOps, StoreManager]
    phases: [design, implement, qa, i18n, store_prep, release]

  unity_game:
    tech_stack: [Unity, C#]
    agents: [Designer, Developer, QA, Localization, DevOps, AssetManager]
    phases: [design, prototype, implement, qa, i18n, build, release]
```

---

## 8. 今後の検討事項

### 8.1 未解決の設計課題
1. **エージェント間の競合解決** - 同じファイルを複数エージェントが編集する場合
2. **ロールバック機構** - 失敗した変更の巻き戻し
3. **Human-in-the-loop最適化** - 介入ポイントの最適化
4. **コスト管理** - APIコール数の最適化
5. **巨大ファイルの分割戦略** - Dinosaviverで73000トークン超のGame.jsxが発生（要リファクタリング指針）

### 8.2 MVP（最小実装）スコープ
1. Orchestrator + Developer + QA の3エージェント構成
2. 単一フェーズ（実装→QA→修正ループ）
3. CLIインターフェース
4. ファイルベースメモリ

### 8.3 将来拡張
1. Web UI / VS Code Extension
2. リアルタイムコラボレーション
3. 学習・改善機構（過去プロジェクトからの学習）
4. マルチモーダル対応（画像アセット生成連携）
5. **デイリーコンテンツ自動生成** - Dinosaviverのデイリーテーマのような日替わりコンテンツ
6. **外部サービス連携Agent** - リーダーボードAPI、デプロイサービス等との統合

### 8.4 Dinosaviverから学んだ実践的課題

| 課題 | 発生状況 | 推奨対策 |
|------|---------|---------|
| 単一ファイル肥大化 | Game.jsxが2000行超 | 早期のコンポーネント分割計画をDesigner Agentに組み込む |
| 翻訳キー追加忘れ | 新機能追加時 | Developer AgentがQA Agentに翻訳確認を自動依頼 |
| 定数のハードコード | 初期実装時 | 定数抽出をDesigner Agentの標準出力に含める |
| テスト不足 | 時間優先で省略 | QA Agentによる自動テスト生成を必須化 |

---

## Appendix A: IGNITIONプロジェクトから抽出したパターン

### A.1 効果的だったパターン
| パターン | 説明 | 適用場面 |
|---------|------|---------|
| 段階的レビュー | 機能カテゴリごとにレビュー | QAフェーズ |
| 即座修正 | バグ発見→即修正のループ | 開発中 |
| 翻訳キー抽出 | ハードコード文字列の体系的抽出 | i18nフェーズ |
| 最小コスト計算 | ゲームロジックの数値検証 | ロジック実装 |

### A.2 改善が必要だったパターン
| 問題 | 原因 | 改善策 |
|-----|------|-------|
| 翻訳漏れの繰り返し発見 | 体系的チェックの欠如 | 自動翻訳キー検出ツール |
| レイアウト問題 | 複数画面サイズ未確認 | 自動レスポンシブテスト |

---

## Appendix B: Dinosaviverプロジェクトから抽出したパターン

### B.1 プロジェクト概要
**Dinosaviver**は草食恐竜を操作して肉食恐竜から生き延びるローグライクサバイバルゲーム。
React + Vite + Tailwind CSSで構築され、デイリーチャレンジとオンラインリーダーボード機能を持つ。

### B.2 開発フローの実例

```
Initial Commit (コア機能)
    ↓
ボスイベント/シナジー/実績/ゲームモード追加
    ↓
レスポンシブ対応・ゲームオーバー改善
    ↓
ポーズ機能実装
    ↓
ボタンシステム/デイリーテーマ/リーダーボード/テキストアップグレード
    ↓
国際化対応 (i18n)
    ↓
オンラインリーダーボード統合
    ↓
ウェーブシステム改善・UI/UX洗練
```

### B.3 効果的だったモジュール化パターン

```
src/
├── game/                    # ゲームロジックモジュール（分離成功）
│   ├── buttonSystem.js      # 「押すな」ボタンシステム
│   ├── dailySystem.js       # デイリーテーマ選択ロジック
│   ├── dailyThemes.js       # 10種類のテーマ定義
│   ├── leaderboard.js       # ローカルリーダーボード
│   ├── onlineLeaderboard.js # オンラインリーダーボード（外部API連携）
│   ├── textUpgrades.js      # テキスト修飾システム
│   ├── upgradeDisplay.js    # アップグレード表示ヘルパー
│   └── utils.js             # SeededRandom等ユーティリティ
├── i18n/                    # 国際化
│   ├── index.js
│   └── locales/
│       ├── ja.json          # 日本語（416行）
│       └── en.json          # 英語（416行）
└── Game.jsx                 # メインコンポーネント（巨大化が課題）
```

**学んだ教訓**:
- ゲームロジックの早期分離が後の拡張を容易にした
- 翻訳キーベースのi18nは追加言語対応を簡単にする
- メインコンポーネント（Game.jsx）の肥大化は要注意（73000トークン超）

### B.4 シードベースデイリーシステムの実装例

```javascript
// dailySystem.js - 決定論的なデイリーテーマ選択
export function getTodayTheme(date = new Date()) {
  const seed = dateToSeed(date);
  const rng = new SeededRandom(seed);

  // LCGの初期状態を混ぜるため、数回空回し
  for (let i = 0; i < 10; i++) rng.next();

  const themeIndex = Math.floor(rng.next() * THEME_IDS.length);
  const themeId = THEME_IDS[themeIndex];

  return { themeId, theme: getTheme(themeId), seed, rng };
}
```

**ポイント**:
- 同じ日付なら世界中で同じテーマが選ばれる
- seedを共有すればリプレイ可能
- LCG空回しで初期偏りを回避

### B.5 テキスト修飾システムのデザインパターン

```javascript
// テキストベースのアップグレード（VERY/SUPER/MEGA等）
export const TEXT_MODIFIERS = {
  VERY:  { multiplier: 1.5, stackable: true, emoji: '⚡' },
  MORE:  { additive: 2, stackable: true, emoji: '➕' },
  SUPER: { multiplier: 2.0, stackable: false, emoji: '💫' },
  MEGA:  { multiplier: 3.0, stackable: false, emoji: '🌟' },
  '???': { special: true, stackable: true, emoji: '❓' }, // ランダム効果
};
```

**デザイン意図**:
- プレイヤーが効果を直感的に理解できる
- スタック可能/不可の区別で戦略性を追加
- `???`のような不確定要素でリプレイ性向上

### B.6 ウェーブシステムの段階的難易度設計

```javascript
const WAVE_CONFIG = {
  // Wave 1-3: チュートリアル的
  // Wave 4-6: 本格開始
  // Wave 7-9: 高難度
  // Wave 10+: カオス

  getEnemyTypes: (wave) => {
    if (wave === 1) return { compy: 1.0 };
    if (wave === 2) return { compy: 0.85, raptor: 0.15 };
    // ... 段階的に敵種を追加
    if (wave >= 10) {
      const chaos = Math.min(wave - 9, 10) * 0.03;
      return { /* 全種混合 + カオス係数 */ };
    }
  },

  getHpMultiplier: (wave) => wave <= 3
    ? 1 + (wave - 1) * 0.08  // 緩やかな上昇
    : 1.16 + (wave - 3) * 0.18,  // 急カーブ
};
```

### B.7 実装で効果的だったパターン

| パターン | 具体例 | 効果 |
|---------|--------|------|
| データ駆動設計 | `DAILY_THEMES`オブジェクトに10テーマの全設定を集約 | 新テーマ追加が容易 |
| 重み付き選択 | `weightedChoice(theme.bossWeights, rng)` | テーマごとの個性化 |
| 翻訳キー方式 | `t('predators.compy.name')` | ハードコード排除 |
| 永続化の抽象化 | `loadData(key, def)` / `saveData(key, data)` | localStorage操作の一元化 |
| 適応システム | 累計スコアに応じた永続ボーナス | 長期的モチベーション |

### B.8 改善が必要だったパターン

| 問題 | 原因 | 学んだ教訓 |
|-----|------|-----------|
| Game.jsxの肥大化 | 初期から分離を考慮しなかった | 早期のコンポーネント分割計画が必要 |
| 定数のハードコード | 初期実装の急ぎ | 定数ファイルへの早期抽出 |
| テストの欠如 | 時間的制約 | ゲームロジック部分は単体テスト可能に設計すべき |
| 翻訳追加の手動作業 | 自動検出がない | grep等で未翻訳キー検出の自動化 |

### B.9 エージェントシステムへの示唆

Dinosaviver開発から得られたエージェントシステムへの具体的な示唆:

1. **Designer Agentへの入力として有効なもの**
   - デイリーテーマのような「バリエーション定義」
   - ウェーブ設定のような「難易度曲線パラメータ」
   - テキスト修飾子のような「システム仕様」

2. **Developer Agentのタスク分割単位**
   - 機能モジュール単位（buttonSystem, dailySystem等）
   - 翻訳ファイル更新は独立タスク

3. **QA Agentのチェックリスト例**
   - 全デイリーテーマでのゲームプレイ確認
   - 全武器進化パスの動作確認
   - モバイル/デスクトップ両対応確認
   - 翻訳キーの網羅性確認

4. **Localization Agentの自動化ポイント**
   - `t('...')` パターンの自動検出
   - JSONファイル間のキー差分チェック
   - 未翻訳キーのレポート生成

---

## Appendix C: 実装済み機能リファレンス（Dinosaviver）

### C.1 ゲームコンテンツ一覧

**敵（5種類）**
| ID | 名前 | 特徴 |
|----|------|------|
| compy | コンピー | 小型・低HP・高速・群れで出現 |
| raptor | ラプトル | 中型・バランス型 |
| carnotaurus | カルノタウルス | 大型・高耐久 |
| spinosaurus | スピノサウルス | 巨大・高HP |
| trex | T-Rex | ボス・最高HP |

**仲間（11種類）**
- Tier 1: brachio, trike, stego, ankylo, para, pachy, ptera
- Tier 2 (Legendary): titanosaur, pachyrhino, kentro, nodosaur

**武器（16種類・4進化ツリー）**
```
acorn → seed → pollen → spore / bloom
     → coconut → rock → meteor / blackhole
     → fruit → amber → crystal / prism
```

**デイリーテーマ（10種類）**
volcano, meteor, compy, bigDino, speed, pollen, rock, ally, press, glitch

**マップスキル（3種類）**
forest, rocky, swamp

**シナジー（4種類）**
earthquake, thornStorm, sonicBoom, rockShield

### C.2 技術仕様

| 項目 | 仕様 |
|------|------|
| フレームワーク | React 18 |
| ビルド | Vite 6 |
| スタイリング | Tailwind CSS 4 |
| 国際化 | i18next / react-i18next |
| 外部API | Simple Leaderboard（オプション） |
| デプロイ | itch.io対応ビルドスクリプト |

---

*Version: 1.1.0*
*Created: 2026-02-05*
*Updated: 2026-02-05*
*Based on: IGNITION Development Process, Dinosaviver Development Experience*
