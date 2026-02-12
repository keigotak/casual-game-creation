/**
 * localStorage ユーティリティ
 * エラーハンドリング付きの永続化ヘルパー
 */

const PREFIX = 'game_';  // 名前空間プレフィックス

/**
 * データを読み込む
 * @param {string} key - ストレージキー
 * @param {*} defaultValue - データがない場合のデフォルト値
 */
export function loadData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.warn(`Failed to load ${key}:`, error);
    return defaultValue;
  }
}

/**
 * データを保存する
 * @param {string} key - ストレージキー
 * @param {*} data - 保存するデータ（JSON化可能なもの）
 */
export function saveData(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn(`Failed to save ${key}:`, error);
    return false;
  }
}

/**
 * データを削除する
 * @param {string} key - ストレージキー
 */
export function removeData(key) {
  try {
    localStorage.removeItem(PREFIX + key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove ${key}:`, error);
    return false;
  }
}

/**
 * 全データをクリアする（このゲームのデータのみ）
 */
export function clearAllData() {
  try {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(PREFIX)
    );
    keys.forEach((k) => localStorage.removeItem(k));
    return true;
  } catch (error) {
    console.warn('Failed to clear data:', error);
    return false;
  }
}

// 使用例:
// saveData('highScore', 1000);
// const highScore = loadData('highScore', 0);
// saveData('settings', { sound: true, language: 'ja' });
