/**
 * 簡易ゲームアナリティクス
 *
 * ゲーム内のプレイヤー行動を記録し、改善に活用するための軽量トラッカー。
 * localStorage にイベントを蓄積し、後で分析できる。
 *
 * 使い方:
 *   import { analytics } from './utils/analytics';
 *
 *   // ゲーム開始時
 *   analytics.trackEvent('game_start');
 *
 *   // スコア記録
 *   analytics.trackEvent('game_over', { score: 150, duration: 45 });
 *
 *   // セッションサマリー取得
 *   const summary = analytics.getSummary();
 */

const STORAGE_KEY = 'game_analytics';
const MAX_EVENTS = 500; // 保持する最大イベント数

class GameAnalytics {
  constructor() {
    this.sessionId = Date.now().toString(36);
    this.sessionStart = Date.now();
    this.events = [];
  }

  /**
   * イベントを記録
   * @param {string} name - イベント名
   * @param {Object} [data] - 追加データ
   */
  trackEvent(name, data = {}) {
    const event = {
      name,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };
    this.events.push(event);
    this._persist(event);
  }

  /**
   * ゲームプレイを記録（よく使うパターン）
   * @param {Object} result - { score, duration, wave, cause }
   */
  trackGamePlay(result) {
    this.trackEvent('game_play', {
      score: result.score || 0,
      duration: result.duration || 0,
      wave: result.wave || 0,
      cause: result.cause || 'unknown',
    });
  }

  /**
   * 蓄積データのサマリーを取得
   * @returns {Object} 分析サマリー
   */
  getSummary() {
    const allEvents = this._loadAll();
    const plays = allEvents.filter((e) => e.name === 'game_play');

    if (plays.length === 0) {
      return { totalPlays: 0, avgScore: 0, avgDuration: 0, bestScore: 0 };
    }

    const scores = plays.map((p) => p.data.score || 0);
    const durations = plays.map((p) => p.data.duration || 0);

    return {
      totalPlays: plays.length,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      avgDuration: Math.round(
        durations.reduce((a, b) => a + b, 0) / durations.length
      ),
      bestScore: Math.max(...scores),
      bestDuration: Math.max(...durations),
      sessions: new Set(allEvents.map((e) => e.sessionId)).size,
      firstPlay: new Date(
        Math.min(...allEvents.map((e) => e.timestamp))
      ).toISOString(),
      lastPlay: new Date(
        Math.max(...allEvents.map((e) => e.timestamp))
      ).toISOString(),
    };
  }

  /**
   * リテンション分析（日別プレイ回数）
   * @returns {Object} { 'YYYY-MM-DD': playCount }
   */
  getDailyRetention() {
    const allEvents = this._loadAll();
    const plays = allEvents.filter((e) => e.name === 'game_play');
    const daily = {};

    for (const play of plays) {
      const date = new Date(play.timestamp).toISOString().split('T')[0];
      daily[date] = (daily[date] || 0) + 1;
    }

    return daily;
  }

  /**
   * データをクリア
   */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    this.events = [];
  }

  // --- Private ---

  _persist(event) {
    try {
      const allEvents = this._loadAll();
      allEvents.push(event);

      // 古いイベントを削除
      const trimmed =
        allEvents.length > MAX_EVENTS
          ? allEvents.slice(allEvents.length - MAX_EVENTS)
          : allEvents;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // localStorage full or unavailable
    }
  }

  _loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const analytics = new GameAnalytics();
