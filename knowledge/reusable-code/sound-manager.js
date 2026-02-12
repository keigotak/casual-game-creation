/**
 * SoundManager (Web Audio API版)
 *
 * Web Audio APIベースのサウンド管理。new Audio() より低レイテンシで
 * モバイル対応も優れている。
 *
 * 使い方:
 *   import { soundManager } from './game/sound-manager';
 *
 *   // 初期化（ユーザー操作のイベントハンドラ内で呼ぶ）
 *   soundManager.init();
 *
 *   // 効果音のプリロード
 *   await soundManager.loadSE('click', './sounds/se/click.mp3');
 *   await soundManager.loadSE('score', './sounds/se/score.mp3');
 *
 *   // 効果音再生（低レイテンシ）
 *   soundManager.playSE('click');
 *
 *   // BGM再生
 *   soundManager.playBGM('./sounds/bgm/main.mp3');
 *
 *   // ミュート切替
 *   soundManager.toggleMute();
 *
 * React Hook:
 *   import { useSound } from './hooks/useSound';
 *
 *   function Game() {
 *     const { playSE, playBGM, stopBGM, toggleMute, isMuted } = useSound();
 *     return <button onClick={() => playSE('click')}>Click</button>;
 *   }
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.buffers = new Map(); // SE用のデコード済みバッファ
    this.bgmSource = null;
    this.bgmGain = null;
    this.seGain = null;
    this.masterGain = null;
    this.isMuted = false;
    this.bgmVolume = 0.5;
    this.seVolume = 0.7;
    this.initialized = false;
  }

  /**
   * AudioContext を初期化
   * ユーザー操作（click, touchstart等）のイベントハンドラ内で呼ぶ必要がある
   */
  init() {
    if (this.initialized) return;

    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();

      // マスター → スピーカー
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);

      // SE用ゲインノード
      this.seGain = this.ctx.createGain();
      this.seGain.gain.value = this.seVolume;
      this.seGain.connect(this.masterGain);

      // BGM用ゲインノード
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  /**
   * AudioContextがsuspended状態の場合にresumeする
   * (モバイルブラウザ対策)
   */
  async resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  /**
   * 効果音をプリロード
   * @param {string} id - 効果音のID
   * @param {string} url - 音声ファイルのURL
   */
  async loadSE(id, url) {
    if (!this.ctx) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
      this.buffers.set(id, audioBuffer);
    } catch (e) {
      console.warn(`Failed to load SE "${id}":`, e);
    }
  }

  /**
   * 複数の効果音を一括プリロード
   * @param {Object} sounds - { id: url } のマップ
   */
  async loadAllSE(sounds) {
    const promises = Object.entries(sounds).map(([id, url]) =>
      this.loadSE(id, url)
    );
    await Promise.allSettled(promises);
  }

  /**
   * 効果音を再生
   * @param {string} id - プリロード済みの効果音ID
   * @param {number} [volume] - 0.0〜1.0（省略時はデフォルトSE音量）
   */
  playSE(id, volume) {
    if (!this.ctx || this.isMuted) return;

    const buffer = this.buffers.get(id);
    if (!buffer) return;

    // suspended対策
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    if (volume !== undefined) {
      const gainNode = this.ctx.createGain();
      gainNode.gain.value = volume;
      source.connect(gainNode);
      gainNode.connect(this.seGain);
    } else {
      source.connect(this.seGain);
    }

    source.start(0);
  }

  /**
   * BGMを再生
   * @param {string} url - 音声ファイルのURL
   * @param {boolean} [loop=true] - ループするか
   */
  async playBGM(url, loop = true) {
    if (!this.ctx) return;

    this.stopBGM();

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      this.bgmSource = this.ctx.createBufferSource();
      this.bgmSource.buffer = audioBuffer;
      this.bgmSource.loop = loop;
      this.bgmSource.connect(this.bgmGain);
      this.bgmSource.start(0);
    } catch (e) {
      console.warn('Failed to play BGM:', e);
    }
  }

  /**
   * BGMを停止
   */
  stopBGM() {
    if (this.bgmSource) {
      try {
        this.bgmSource.stop();
      } catch {
        // already stopped
      }
      this.bgmSource = null;
    }
  }

  /**
   * ミュート切替
   * @returns {boolean} 新しいミュート状態
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
    }
    return this.isMuted;
  }

  /**
   * SE音量を設定
   * @param {number} volume - 0.0〜1.0
   */
  setSEVolume(volume) {
    this.seVolume = volume;
    if (this.seGain) {
      this.seGain.gain.value = volume;
    }
  }

  /**
   * BGM音量を設定
   * @param {number} volume - 0.0〜1.0
   */
  setBGMVolume(volume) {
    this.bgmVolume = volume;
    if (this.bgmGain) {
      this.bgmGain.gain.value = volume;
    }
  }

  /**
   * 全リソースを解放
   */
  dispose() {
    this.stopBGM();
    this.buffers.clear();
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.initialized = false;
  }
}

export const soundManager = new SoundManager();

/**
 * React Hook: サウンド管理
 *
 * 使い方:
 *   const { playSE, playBGM, stopBGM, toggleMute, isMuted } = useSound();
 *
 * 注意: このフックを使うファイルで以下をimportしてください:
 *   import { useState, useCallback, useEffect } from 'react';
 */
export function useSound() {
  const { useState, useCallback, useEffect } = require('react');

  const [isMuted, setIsMuted] = useState(soundManager.isMuted);

  // 初回ユーザー操作でAudioContextを初期化
  useEffect(() => {
    const handleInteraction = () => {
      soundManager.init();
      soundManager.resume();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const playSE = useCallback((id, volume) => {
    soundManager.playSE(id, volume);
  }, []);

  const playBGM = useCallback((url, loop = true) => {
    soundManager.playBGM(url, loop);
  }, []);

  const stopBGM = useCallback(() => {
    soundManager.stopBGM();
  }, []);

  const toggleMute = useCallback(() => {
    const newState = soundManager.toggleMute();
    setIsMuted(newState);
    return newState;
  }, []);

  return { playSE, playBGM, stopBGM, toggleMute, isMuted };
}
