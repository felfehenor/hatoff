import { GameHero, GameResource } from '../interfaces';
import { getEntry } from './content';
import { gamestate, setGameState } from './gamestate';
import { addHero, canRecruitHero, createHero, totalHeroes } from './hero';
import { notifyError } from './notify';
import { isResearchComplete } from './research';
import { hasResource, loseResource } from './resource';

export function setResetTime(): void {
  const state = gamestate();
  state.recruitment.nextResetTime = Date.now() + 3600_000;
  setGameState(state);
}

export function resetRerolls(): void {
  const state = gamestate();
  state.recruitment.numRerolls = 0;
  setGameState(state);
}

export function generateHeroesToRecruit() {
  const state = gamestate();

  state.recruitment.recruitableHeroes = [];
  for (let i = 0; i < 6; i++) {
    state.recruitment.recruitableHeroes.push(createHero());
  }

  setGameState(state);
}

export function recruitHero(hero: GameHero): void {
  const resource = getEntry<GameResource>('Food');
  if (!resource) return;

  const state = gamestate();

  if (!state.recruitment.recruitableHeroes.includes(hero)) {
    notifyError('That hero is not available for recruitment!');
    return;
  }

  loseResource(resource, recruitCost());
  addHero(hero);
}

export function doReroll(): void {
  const resource = getEntry<GameResource>('Food');
  if (!resource) return;

  generateHeroesToRecruit();
  loseResource(resource, rerollCost());

  const state = gamestate();
  state.recruitment.numRerolls += 1;
  setGameState(state);
}

export function canRecruit(): boolean {
  const resource = getEntry<GameResource>('Food');
  if (!resource) return false;

  return (
    isResearchComplete('Help Posters') &&
    canRecruitHero() &&
    hasResource(resource, recruitCost())
  );
}

export function canReroll(): boolean {
  const resource = getEntry<GameResource>('Food');
  if (!resource) return false;

  return hasResource(resource, rerollCost());
}

export function rerollCost(): number {
  const totalRerolls = 1 + (gamestate().recruitment.numRerolls ?? 0);
  return recruitCost() + Math.floor(Math.pow(totalRerolls, 1.5)) * 5;
}

export function recruitCost(): number {
  const heroesRecruited = totalHeroes();
  return Math.floor(Math.pow(heroesRecruited, 1.9) * 5);
}
