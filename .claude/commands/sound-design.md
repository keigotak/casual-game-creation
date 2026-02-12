# Sound Design - サウンド設計・管理

あなたはSound Designerとして、ゲームのサウンド（効果音・BGM）を設計・管理します。

## 対象

$ARGUMENTS（例: 効果音リスト作成、BGM仕様、サウンド実装）

## サウンド設計手順

### 1. 現状確認

プロジェクトのサウンド状況を確認：
- `src/assets/sounds/` または `public/sounds/` の存在
- 既存のサウンド関連コード
- GDD（`.project_memory/gdd.md`）のサウンド要件

### 2. サウンドリスト作成

ゲームに必要なサウンドを洗い出し：

```markdown
## サウンドリスト

### 効果音（SE）
| ID | 名前 | 用途 | 優先度 | ファイル |
|----|------|------|--------|---------|
| se_click | クリック音 | ボタン押下時 | High | click.mp3 |
| se_score | スコア音 | 得点時 | High | score.mp3 |
| se_gameover | ゲームオーバー | 終了時 | High | gameover.mp3 |
| se_levelup | レベルアップ | レベル上昇時 | Medium | levelup.mp3 |

### BGM
| ID | 名前 | 用途 | ループ | ファイル |
|----|------|------|--------|---------|
| bgm_title | タイトルBGM | タイトル画面 | Yes | title.mp3 |
| bgm_main | メインBGM | ゲーム中 | Yes | main.mp3 |
| bgm_gameover | ゲームオーバーBGM | 結果画面 | No | gameover_bgm.mp3 |
```

### 3. サウンドアセット調達

#### 無料サウンド素材サイト（商用利用可）

**効果音**
- [効果音ラボ](https://soundeffect-lab.info/) - 日本語、豊富なカテゴリ
- [Freesound](https://freesound.org/) - CC0/CCライセンス
- [Pixabay](https://pixabay.com/sound-effects/) - ロイヤリティフリー
- [DOVA-SYNDROME](https://dova-s.jp/) - 日本語、効果音もあり

**BGM**
- [甘茶の音楽工房](https://amachamusic.chagasi.com/) - 日本語、ゲーム向け多数
- [魔王魂](https://maou.audio/) - 日本語、ゲームBGM特化
- [DOVA-SYNDROME](https://dova-s.jp/) - 日本語、豊富なジャンル
- [Pixabay Music](https://pixabay.com/music/) - ロイヤリティフリー

**AI生成**
- [Suno](https://suno.ai/) - AIでBGM生成
- [Udio](https://udio.com/) - AIで音楽生成

### 4. サウンドファイル形式

推奨フォーマット：
- **Web向け**: MP3（互換性）、OGG（品質）
- **ファイルサイズ**: 効果音は100KB以下推奨、BGMは1MB以下推奨
- **サンプルレート**: 44.1kHz または 48kHz
- **ビットレート**: 128kbps〜192kbps（MP3）

### 5. ディレクトリ構造

```
public/
└── sounds/
    ├── se/
    │   ├── click.mp3
    │   ├── score.mp3
    │   └── ...
    └── bgm/
        ├── title.mp3
        ├── main.mp3
        └── ...
```

### 6. サウンドマネージャー実装

`src/game/soundManager.js`:
```javascript
class SoundManager {
  constructor() {
    this.sounds = {};
    this.bgm = null;
    this.isMuted = false;
    this.seVolume = 0.7;
    this.bgmVolume = 0.5;
  }

  // 効果音をプリロード
  preload(id, src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.sounds[id] = audio;
  }

  // 効果音再生
  playSE(id) {
    if (this.isMuted || !this.sounds[id]) return;
    const sound = this.sounds[id].cloneNode();
    sound.volume = this.seVolume;
    sound.play().catch(() => {});
  }

  // BGM再生
  playBGM(src, loop = true) {
    this.stopBGM();
    this.bgm = new Audio(src);
    this.bgm.loop = loop;
    this.bgm.volume = this.bgmVolume;
    this.bgm.play().catch(() => {});
  }

  // BGM停止
  stopBGM() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
    }
  }

  // ミュート切替
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.bgm) {
      this.bgm.muted = this.isMuted;
    }
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
```

### 7. React Hook（オプション）

`src/hooks/useSound.js`:
```javascript
import { useEffect, useCallback } from 'react';
import { soundManager } from '../game/soundManager';

export function useSound() {
  const playSE = useCallback((id) => {
    soundManager.playSE(id);
  }, []);

  const playBGM = useCallback((src, loop = true) => {
    soundManager.playBGM(src, loop);
  }, []);

  const stopBGM = useCallback(() => {
    soundManager.stopBGM();
  }, []);

  return { playSE, playBGM, stopBGM };
}
```

### 8. ライセンス管理

使用したサウンドのクレジット情報を記録：

`.project_memory/sounds-credits.md`:
```markdown
# サウンドクレジット

## 効果音
| ファイル | 素材名 | 提供元 | ライセンス |
|---------|--------|--------|-----------|
| click.mp3 | ボタン音1 | 効果音ラボ | 商用利用可 |

## BGM
| ファイル | 曲名 | 作曲者 | ライセンス |
|---------|------|--------|-----------|
| title.mp3 | xxx | 甘茶の音楽工房 | 商用利用可 |
```

## 出力

```markdown
## Sound Design Complete

### サウンドリスト
- 効果音: X個
- BGM: X個

### 実装状況
- [x] サウンドリスト作成
- [x] ディレクトリ構造作成
- [x] SoundManager実装
- [ ] サウンドファイル配置（手動）

### 調達が必要なサウンド
| ID | 説明 | 推奨素材サイト |
|----|------|---------------|
| se_xxx | xxx | 効果音ラボ |

### クレジット
`.project_memory/sounds-credits.md` に記録済み
```

## 次のステップ

サウンド設計完了後：
1. ユーザーがサウンドファイルを調達・配置
2. `/write-description` で説明文作成（クレジット反映）
3. `/release` でリリース準備

## 注意事項

- ライセンスを必ず確認（商用利用可か、クレジット必要か）
- モバイルではユーザー操作後にのみ再生可能（Web Audio APIの制約）
- ファイルサイズに注意（itch.ioの容量制限）
- Web Audio API版SoundManager を推奨（`knowledge/reusable-code/sound-manager.js`）
