/**
 * シード付き乱数生成器
 * デイリーチャレンジなど、再現可能な乱数が必要な場面で使用
 */

export class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  /**
   * 0-1の乱数を生成（LCG: Linear Congruential Generator）
   */
  next() {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  /**
   * min以上max未満の整数を生成
   */
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * 配列からランダムに1つ選択
   */
  choice(array) {
    return array[this.nextInt(0, array.length)];
  }

  /**
   * 重み付き選択
   * @param {Object} weights - { key: weight } の形式
   */
  weightedChoice(weights) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let random = this.next() * total;

    for (const [key, weight] of entries) {
      random -= weight;
      if (random <= 0) return key;
    }

    return entries[entries.length - 1][0];
  }
}

/**
 * 日付からシードを生成
 * 同じ日付なら同じシードになる
 */
export function dateToSeed(date = new Date()) {
  return (
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()
  );
}

/**
 * 今日のシード付き乱数生成器を取得
 */
export function getTodayRng() {
  const seed = dateToSeed();
  const rng = new SeededRandom(seed);

  // LCGの初期偏りを除去するため空回し
  for (let i = 0; i < 10; i++) rng.next();

  return { seed, rng };
}

// 使用例:
// const { seed, rng } = getTodayRng();
// const todayTheme = rng.choice(['fire', 'ice', 'wind', 'earth']);
