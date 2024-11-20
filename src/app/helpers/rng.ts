import seedrandom, { type PRNG } from 'seedrandom';
import { v4 as uuid } from 'uuid';
import { Identifiable } from '../interfaces';

export function randomrng(): PRNG {
  return seededrng(uuid());
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

export function randomChoice<T>(choices: T[], seed = uuid()): T {
  const rng = seededrng(seed);

  // throw away the first 2 rng values. who needs 'em anyway?
  rng();
  rng();

  return choices[Math.floor(rng() * choices.length)];
}
