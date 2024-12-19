import seedrandom, { type PRNG } from 'seedrandom';
import { v4 as uuid } from 'uuid';
import { Identifiable } from '../interfaces';

export function uniqueId(): string {
  return uuid();
}

export function randomrng(): PRNG {
  return seededrng(uniqueId());
}

export function seededrng(seed: string): PRNG {
  return seedrandom(seed);
}

export function randomIdentifiableChoice<T extends Identifiable>(
  seed: string,
  choices: T[],
): string {
  const rng = seededrng(seed);
  return choices[Math.floor(rng() * choices.length)].id;
}

export function randomNumber(max: number, seed = uniqueId()): number {
  return Math.floor(seededrng(seed)() * max);
}

export function succeedsChance(max: number, seed = uniqueId()): boolean {
  return seededrng(seed)() * 100 <= max;
}

export function randomChoice<T>(choices: T[], seed = uniqueId()): T {
  const rng = seededrng(seed);

  // throw away the first 2 rng values. who needs 'em anyway?
  rng();
  rng();

  return choices[Math.floor(rng() * choices.length)];
}
