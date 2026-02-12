/**
 * FPSモニター
 *
 * ゲームのフレームレートを計測・表示するデバッグツール。
 * 開発時のパフォーマンス問題の早期発見に使用。
 *
 * 使い方（スタンドアロン）:
 *   import { fpsMonitor } from './utils/fps-monitor';
 *
 *   // ゲームループ内で毎フレーム呼ぶ
 *   function gameLoop() {
 *     fpsMonitor.tick();
 *     // ... ゲーム処理 ...
 *     requestAnimationFrame(gameLoop);
 *   }
 *
 *   // FPS取得
 *   console.log(fpsMonitor.getFPS());     // 現在のFPS
 *   console.log(fpsMonitor.getStats());   // 詳細統計
 *
 * 使い方（React Hook）:
 *   import { useFPSMonitor } from './hooks/fps-monitor';
 *
 *   function Game() {
 *     const { fps, stats } = useFPSMonitor(isRunning);
 *     return <div>FPS: {fps}</div>;
 *   }
 */

class FPSMonitor {
  constructor() {
    this.frames = [];
    this.lastTime = 0;
    this.fps = 0;
    this.history = []; // 直近60秒のFPS記録
    this.maxHistory = 60;
  }

  /**
   * 毎フレーム呼び出す
   * @param {number} [now] - 現在時刻(ms)。省略時はperformance.now()
   */
  tick(now) {
    if (!now) now = performance.now();

    this.frames.push(now);

    // 直近1秒のフレームだけ保持
    const oneSecondAgo = now - 1000;
    while (this.frames.length > 0 && this.frames[0] < oneSecondAgo) {
      this.frames.shift();
    }

    this.fps = this.frames.length;

    // 1秒ごとに履歴に記録
    if (now - this.lastTime >= 1000) {
      this.history.push(this.fps);
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      this.lastTime = now;
    }
  }

  /**
   * 現在のFPSを取得
   * @returns {number}
   */
  getFPS() {
    return this.fps;
  }

  /**
   * 詳細統計を取得
   * @returns {Object} { current, avg, min, max, drops }
   */
  getStats() {
    if (this.history.length === 0) {
      return { current: this.fps, avg: 0, min: 0, max: 0, drops: 0 };
    }

    const avg = Math.round(
      this.history.reduce((a, b) => a + b, 0) / this.history.length
    );
    const min = Math.min(...this.history);
    const max = Math.max(...this.history);
    // 30fps以下のフレームドロップ回数
    const drops = this.history.filter((f) => f < 30).length;

    return { current: this.fps, avg, min, max, drops };
  }

  /**
   * リセット
   */
  reset() {
    this.frames = [];
    this.history = [];
    this.fps = 0;
    this.lastTime = 0;
  }
}

export const fpsMonitor = new FPSMonitor();

/**
 * React Hook: FPSモニター
 *
 * @param {boolean} isRunning - ゲームが実行中かどうか
 * @returns {{ fps: number, stats: Object }}
 */
export function useFPSMonitor(isRunning) {
  // Note: この関数を使うファイルで以下をimportしてください:
  // import { useState, useEffect, useRef } from 'react';
  const { useState, useEffect, useRef } = require('react');

  const [fps, setFps] = useState(0);
  const [stats, setStats] = useState({
    current: 0,
    avg: 0,
    min: 0,
    max: 0,
    drops: 0,
  });
  const monitorRef = useRef(new FPSMonitor());
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      monitorRef.current.reset();
      return;
    }

    let running = true;

    const loop = () => {
      if (!running) return;
      monitorRef.current.tick();
      setFps(monitorRef.current.getFPS());
      setStats(monitorRef.current.getStats());
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning]);

  return { fps, stats };
}
