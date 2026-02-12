# Init Project - ゲームプロジェクト初期化

新しいWebゲームプロジェクトを `projects/` ディレクトリ内に作成します。

## プロジェクト名

$ARGUMENTS（例: my-awesome-game）

## 初期化手順

### 1. プロジェクトディレクトリ確認

プロジェクトは `projects/[project-name]/` に作成されます。

```bash
# 既存プロジェクト確認
ls projects/
```

同名のプロジェクトが存在する場合は中止してください。

### 2. テンプレート選択

ユーザーに確認（デフォルトはJavaScript）：

- **JavaScript** (デフォルト): `npm create vite@latest [project-name] -- --template react`
- **TypeScript** (推奨): `npm create vite@latest [project-name] -- --template react-ts`

```bash
cd projects
npm create vite@latest [project-name] -- --template react  # or react-ts
cd [project-name]
npm install
```

### 3. 依存関係インストール

```bash
# Tailwind CSS v4（Viteプラグイン方式）
npm install -D tailwindcss @tailwindcss/vite

# i18n
npm install i18next react-i18next i18next-browser-languagedetector

# テスト
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 4. Vite設定（itch.io + Tailwind v4 + vitest対応）

`vite.config.js`（TypeScriptの場合は `vite.config.ts`）：
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',  // itch.io用：相対パス必須
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

### 5. Tailwind CSS v4設定

`src/index.css`（v4はCSSファイルのみで設定完結）:
```css
@import "tailwindcss";
```

**注意**: Tailwind v4 では `tailwind.config.js` は不要。設定は CSS で直接行う。

### 6. テストセットアップ

`src/test/setup.js`:
```javascript
import '@testing-library/jest-dom';
```

`package.json` の scripts に追加:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

### 7. i18n設定

`src/i18n/index.js`:
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ja from './locales/ja.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    fallbackLng: 'ja',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

`src/i18n/locales/ja.json`:
```json
{
  "title": {
    "game_name": "ゲームタイトル",
    "start": "スタート",
    "settings": "設定"
  },
  "game": {
    "score": "スコア",
    "pause": "ポーズ",
    "resume": "再開"
  },
  "gameover": {
    "title": "ゲームオーバー",
    "retry": "もう一度",
    "to_title": "タイトルへ",
    "high_score": "ハイスコア",
    "new_record": "新記録!"
  },
  "settings": {
    "sound": "サウンド",
    "language": "言語"
  }
}
```

`src/i18n/locales/en.json`:
```json
{
  "title": {
    "game_name": "Game Title",
    "start": "Start",
    "settings": "Settings"
  },
  "game": {
    "score": "Score",
    "pause": "Pause",
    "resume": "Resume"
  },
  "gameover": {
    "title": "Game Over",
    "retry": "Retry",
    "to_title": "Title",
    "high_score": "High Score",
    "new_record": "New Record!"
  },
  "settings": {
    "sound": "Sound",
    "language": "Language"
  }
}
```

### 8. ディレクトリ構造作成

```bash
mkdir -p src/components
mkdir -p src/game
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/test
```

### 9. プロジェクトメモリ作成

`shared/templates/project_memory/` から `.project_memory/` にコピー：

```bash
cp -r ../../shared/templates/project_memory .project_memory
```

### 10. ゲーム設定定数

`src/game/config.js`:
```javascript
export const GAME_CONFIG = {
  // Canvas
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 600,

  // Game
  TARGET_FPS: 60,
  INITIAL_LIVES: 3,

  // Player
  PLAYER_SPEED: 5,
  PLAYER_SIZE: 32,

  // Scoring
  SCORE_PER_POINT: 10,

  // Storage keys
  STORAGE_PREFIX: 'game_',
  HIGH_SCORE_KEY: 'highScore',
};

export const GAME_STATES = {
  TITLE: 'title',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
};
```

### 11. ベースコンポーネント作成

`src/Game.jsx`:
```jsx
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GAME_STATES } from './game/config';

export default function Game() {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState(GAME_STATES.TITLE);
  const [score, setScore] = useState(0);

  const startGame = useCallback(() => {
    setScore(0);
    setGameState(GAME_STATES.PLAYING);
  }, []);

  const endGame = useCallback(() => {
    setGameState(GAME_STATES.GAMEOVER);
  }, []);

  const returnToTitle = useCallback(() => {
    setGameState(GAME_STATES.TITLE);
  }, []);

  // Title Screen
  if (gameState === GAME_STATES.TITLE) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">{t('title.game_name')}</h1>
        <button
          onClick={startGame}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl transition-colors"
        >
          {t('title.start')}
        </button>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === GAME_STATES.GAMEOVER) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-4">{t('gameover.title')}</h1>
        <p className="text-2xl mb-8">{t('game.score')}: {score}</p>
        <div className="flex gap-4">
          <button onClick={startGame} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            {t('gameover.retry')}
          </button>
          <button onClick={returnToTitle} className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
            {t('gameover.to_title')}
          </button>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute top-4 left-4 text-xl">
        {t('game.score')}: {score}
      </div>
      {/* ゲームコンテンツをここに実装 */}
    </div>
  );
}
```

### 12. App.jsx更新

`src/App.jsx`:
```jsx
import './i18n';
import Game from './Game';

function App() {
  return <Game />;
}

export default App;
```

### 13. サンプルテスト作成

`src/test/config.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { GAME_STATES, GAME_CONFIG } from '../game/config';

describe('GAME_STATES', () => {
  it('should have all required states', () => {
    expect(GAME_STATES.TITLE).toBeDefined();
    expect(GAME_STATES.PLAYING).toBeDefined();
    expect(GAME_STATES.PAUSED).toBeDefined();
    expect(GAME_STATES.GAMEOVER).toBeDefined();
  });
});

describe('GAME_CONFIG', () => {
  it('should have positive canvas dimensions', () => {
    expect(GAME_CONFIG.CANVAS_WIDTH).toBeGreaterThan(0);
    expect(GAME_CONFIG.CANVAS_HEIGHT).toBeGreaterThan(0);
  });
});
```

### 14. itch.ioビルドスクリプト追加

```bash
cp ../../shared/templates/itch-build.sh .
chmod +x itch-build.sh
```

### 15. 再利用可能コードのコピー（オプション）

必要に応じて `knowledge/reusable-code/` から流用：

```bash
# シード付き乱数（デイリーチャレンジ用）
cp ../../knowledge/reusable-code/seeded-random.js src/utils/

# localStorage永続化
cp ../../knowledge/reusable-code/storage.js src/utils/

# ゲームループフック
cp ../../knowledge/reusable-code/use-game-loop.js src/hooks/

# FPSモニター（デバッグ用）
cp ../../knowledge/reusable-code/fps-monitor.js src/utils/

# サウンドマネージャー（Web Audio API版）
cp ../../knowledge/reusable-code/sound-manager.js src/game/

# 簡易アナリティクス
cp ../../knowledge/reusable-code/analytics.js src/utils/
```

### 16. .gitignore設定

```
node_modules/
dist/
.DS_Store
*.local
*.zip
```

### 17. Git初期化

```bash
git init
git add .
git commit -m "Initial commit: Vite + React + Tailwind v4 + i18n + vitest"
```

## 出力

初期化完了後、以下を報告：

```markdown
## Project Initialized

**プロジェクト名**: [name]
**パス**: projects/[name]/
**テンプレート**: JavaScript / TypeScript

### セットアップ完了
- [x] Vite + React（itch.io対応済み）
- [x] Tailwind CSS v4（Viteプラグイン方式）
- [x] i18next（ja/en）
- [x] vitest + Testing Library
- [x] ゲーム設定定数（config.js）
- [x] プロジェクトメモリ (.project_memory/)
- [x] itch.ioビルドスクリプト
- [x] Git初期化

### ディレクトリ構造
projects/[name]/
├── src/
│   ├── components/
│   ├── game/
│   │   └── config.js
│   ├── hooks/
│   ├── utils/
│   ├── test/
│   │   ├── setup.js
│   │   └── config.test.js
│   ├── i18n/
│   │   └── locales/
│   │       ├── ja.json
│   │       └── en.json
│   ├── Game.jsx
│   └── App.jsx
├── .project_memory/
└── package.json

### 次のステップ
1. `/design-gdd [ゲームコンセプト]` でGDD作成
2. `npm run dev` で開発サーバー起動
3. `src/Game.jsx` にゲームロジック実装
```

## 注意事項

- 既存プロジェクトがある場合は上書きしない
- npm create vite の実行にはユーザー確認が必要
- プロジェクト固有のメモリは `.project_memory/` に保存
- 横断的な知見は `knowledge/` に追記
