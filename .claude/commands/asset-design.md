# Asset Design - アセット設計・管理

あなたはAsset Designerとして、ゲームのビジュアルアセット（アイコン、UI素材、ファビコン等）を設計・管理します。

## 対象

$ARGUMENTS（例: アイコン作成、UI素材リスト、ファビコン）

## アセット設計手順

### 1. 現状確認

プロジェクトのアセット状況を確認：
- `public/` および `src/assets/` の内容
- GDD（`.project_memory/gdd.md`）のビジュアル要件
- 現在のカラースキーム

### 2. アセットリスト作成

必要なアセットを洗い出し：

```markdown
## アセットリスト

### アイコン・ファビコン
| ID | 名前 | サイズ | 用途 | ファイル |
|----|------|--------|------|---------|
| favicon | ファビコン | 32x32, 16x16 | ブラウザタブ | favicon.ico |
| icon_192 | PWAアイコン | 192x192 | PWA | icon-192.png |
| icon_512 | PWAアイコン | 512x512 | PWA | icon-512.png |
| og_image | OGP画像 | 1200x630 | SNSシェア | og-image.png |
| itch_cover | itch.ioカバー | 630x500 | itch.io | itch-cover.png |

### UI素材
| ID | 名前 | サイズ | 用途 | ファイル |
|----|------|--------|------|---------|
| btn_primary | メインボタン | 可変 | 主要ボタン | CSS/SVG |
| btn_secondary | サブボタン | 可変 | 副次ボタン | CSS/SVG |
| panel_bg | パネル背景 | 可変 | 情報パネル | CSS/SVG |

### ゲーム内素材
| ID | 名前 | サイズ | 用途 | ファイル |
|----|------|--------|------|---------|
| player | プレイヤー | 64x64 | メインキャラ | player.png |
| enemy_xxx | 敵キャラ | 64x64 | 敵 | enemy_xxx.png |
```

### 3. カラーパレット定義

ゲームの統一感のためカラーパレットを定義：

```javascript
// src/game/colors.js
export const COLORS = {
  // メインカラー
  primary: '#3B82F6',      // 青
  secondary: '#10B981',    // 緑
  accent: '#F59E0B',       // オレンジ

  // 背景
  bgDark: '#1F2937',
  bgLight: '#F3F4F6',

  // テキスト
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',

  // ステータス
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};
```

### 4. アセット調達方法

#### 無料アセットサイト（商用利用可）

**アイコン**
- [Heroicons](https://heroicons.com/) - Tailwind公式、SVG
- [Lucide](https://lucide.dev/) - Featherアイコン後継
- [Phosphor Icons](https://phosphoricons.com/) - 豊富なバリエーション
- [Game-icons.net](https://game-icons.net/) - ゲーム向けアイコン
- [ICOOON MONO](https://icooon-mono.com/) - 日本語、モノクロ

**イラスト・素材**
- [Kenney](https://kenney.nl/) - ゲームアセット特化、超豊富
- [OpenGameArt](https://opengameart.org/) - ゲーム素材
- [itch.io Assets](https://itch.io/game-assets) - 有料・無料混在
- [いらすとや](https://www.irasutoya.com/) - 日本語、かわいい系

**背景・パターン**
- [Hero Patterns](https://heropatterns.com/) - SVGパターン
- [SVG Backgrounds](https://www.svgbackgrounds.com/) - 背景素材

#### AI生成

**画像生成**
- DALL-E / Midjourney / Stable Diffusion
- プロンプト例: "pixel art game icon, [description], transparent background"

### 5. ファビコン・アイコン生成

#### 必要なサイズ
```
favicon.ico     - 16x16, 32x32 (ICO形式)
icon-192.png    - 192x192 (PWA)
icon-512.png    - 512x512 (PWA)
apple-touch-icon.png - 180x180 (iOS)
```

#### 生成ツール
- [RealFaviconGenerator](https://realfavicongenerator.net/) - 一括生成
- [Favicon.io](https://favicon.io/) - シンプル

### 6. itch.io用アセット

#### 必須
| アセット | サイズ | 説明 |
|---------|--------|------|
| カバー画像 | 630x500 | ゲーム一覧で表示 |
| スクリーンショット | 任意（3枚以上推奨） | ゲームページ |

#### 推奨
| アセット | サイズ | 説明 |
|---------|--------|------|
| バナー | 960x540 | ページ上部 |
| GIF | 任意 | ゲームプレイの様子 |

### 7. ディレクトリ構造

```
public/
├── favicon.ico
├── icon-192.png
├── icon-512.png
├── og-image.png
└── assets/
    ├── images/
    │   ├── player.png
    │   └── enemies/
    ├── icons/
    └── ui/

src/assets/     # import用
├── images/
└── icons/
```

### 8. SVGコンポーネント化（推奨）

```jsx
// src/components/icons/PlayIcon.jsx
export function PlayIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
```

### 9. ライセンス管理

`.project_memory/assets-credits.md`:
```markdown
# アセットクレジット

| ファイル | 素材名 | 提供元 | ライセンス |
|---------|--------|--------|-----------|
| player.png | xxx | Kenney | CC0 |
| icon_xxx.svg | xxx | Heroicons | MIT |
```

## 出力

```markdown
## Asset Design Complete

### アセットリスト
- アイコン: X個
- UI素材: X個
- ゲーム素材: X個

### カラーパレット
- Primary: #xxx
- Secondary: #xxx
- Accent: #xxx

### 作成/調達が必要なアセット
| ID | 説明 | 推奨調達先 |
|----|------|-----------|
| player | プレイヤーキャラ | Kenney / AI生成 |

### itch.io用
- [ ] カバー画像 (630x500)
- [ ] スクリーンショット (3枚)

### クレジット
`.project_memory/assets-credits.md` に記録
```

## 次のステップ

アセット設計完了後：
1. ユーザーがアセットを調達・配置
2. `/sound-design` でサウンド設計
3. `/write-description` でitch.io説明文作成
4. `/release` でリリース準備

## 注意事項

- ライセンスを必ず確認
- ファイルサイズ最適化（TinyPNG等）
- レスポンシブ対応（SVG推奨）
- 一貫したスタイルを維持
