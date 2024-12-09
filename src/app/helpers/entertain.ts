import { sample } from 'lodash';
import { updateGamestate } from './gamestate';
import { allHeroes } from './hero';

export function modifyHeroRerollTimer(byTicks: number): void {
  updateGamestate((state) => {
    state.cooldowns.nextRecruitResetTime = Math.max(
      0,
      (state.cooldowns.nextRecruitResetTime -= byTicks),
    );
    return state;
  });
}

export function modifyShopRerollTimer(byTicks: number): void {
  updateGamestate((state) => {
    state.cooldowns.nextShopResetTime = Math.max(
      0,
      (state.cooldowns.nextShopResetTime -= byTicks),
    );
    return state;
  });
}

export function modifyExploreTimer(byTicks: number): void {
  updateGamestate((state) => {
    state.exploration.currentStepTicks += byTicks;
    return state;
  });
}

export function modifyHeroBuffTimer(byTicks: number): void {
  const hero = sample(
    allHeroes().filter((h) => Object.keys(h.buffTicks ?? {}).length > 0),
  );
  if (!hero) return;

  const buff = sample(Object.keys(hero.buffTicks ?? {}));
  if (!buff) return;

  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.buffTicks[buff] += byTicks;
    return state;
  });
}

export function modifyDefenseTimer(byTicks: number): void {
  updateGamestate((state) => {
    state.cooldowns.nextDefenseAttackTime += byTicks;
    return state;
  });
}
