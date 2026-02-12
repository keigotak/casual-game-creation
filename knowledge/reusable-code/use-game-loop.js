/**
 * ゲームループ用カスタムフック
 * requestAnimationFrame を使用した滑らかなゲームループ
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * ゲームループフック
 * @param {Function} callback - 毎フレーム呼ばれるコールバック (deltaTime) => void
 * @param {boolean} isRunning - ループを実行するかどうか
 */
export function useGameLoop(callback, isRunning = true) {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const callbackRef = useRef(callback);

  // コールバックを最新に保つ
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
}

/**
 * 固定タイムステップのゲームループフック
 * 物理演算など一定間隔で処理したい場合に使用
 * @param {Function} callback - 毎ステップ呼ばれるコールバック
 * @param {number} fps - 目標FPS（デフォルト60）
 * @param {boolean} isRunning - ループを実行するかどうか
 */
export function useFixedGameLoop(callback, fps = 60, isRunning = true) {
  const intervalRef = useRef();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (isRunning) {
      const interval = 1000 / fps;
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, interval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, fps]);
}

// 使用例:
// useGameLoop((deltaTime) => {
//   // deltaTimeはミリ秒
//   const seconds = deltaTime / 1000;
//   player.x += player.vx * seconds;
// }, gameState === 'playing');
