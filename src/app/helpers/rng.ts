import seedrandom, { type PRNG } from 'seedrandom';
import { Identifiable } from '../interfaces';

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

export function randomChoice<T>(seed: string, choices: T[]): T {
  const rng = seededrng(seed);
  return choices[Math.floor(rng() * choices.length)];
}
