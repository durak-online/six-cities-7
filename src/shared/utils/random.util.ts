export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, precision = 1): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(precision));
}

export function randomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function pickRandom<T>(list: readonly T[]): T {
  return list[randomInt(0, list.length - 1)];
}

export function pickRandomManyUnique<T>(list: readonly T[], count: number): T[] {
  if (count > list.length) {
    throw new Error(`Cannot pick ${count} unique items from list of ${list.length}`);
  }

  const copy = [...list];

  for (let i = 0; i < count; i++) {
    const j = randomInt(i, copy.length - 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, count);
}

export function randomDateInLastMonth(): Date {
  const now = Date.now();
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  return new Date(randomInt(monthAgo, now));
}
