import {
  GameHero,
  GameHeroStat,
  GameResource,
  SpecialGameHero,
} from '../interfaces';
import { getEntry } from './content';
import { cooldown } from './cooldown';
import { gamestate, setGameState, updateGamestate } from './gamestate';
import {
  addHero,
  canRecruitHero,
  createHero,
  createSpecialHero,
  getRandomSpecialHero,
  totalHeroes,
} from './hero';
import { notify, notifyError } from './notify';
import {
  allUnlockedStatBoostResearchValue,
  isResearchComplete,
} from './research';
import { hasResource, loseResource } from './resource';
import { seededrng, succeedsChance, uniqueId } from './rng';

export function setRecruitResetTime(): void {
  updateGamestate((state) => {
    state.cooldowns.nextRecruitResetTime = cooldown('nextRecruitResetTime');
    return state;
  });
}

export function resetRecruitRerolls(): void {
  updateGamestate((state) => {
    state.recruitment.numRerolls = 0;
    return state;
  });
}

export function generateHeroesToRecruit() {
  const state = gamestate();

  const recruitSeed = uniqueId();
  const rng = seededrng(recruitSeed);

  function statBonusForRecruit(stat: GameHeroStat): number {
    const maxBoost = allUnlockedStatBoostResearchValue(stat);
    return Math.round(rng() * maxBoost);
  }

  function doesHeroExist(hero: SpecialGameHero) {
    if (
      state.recruitment.recruitableHeroes
        .filter(Boolean)
        .find((s) => s!.id === hero.id)
    )
      return true;
    if (state.heroes[hero.id]) return true;

    return false;
  }

  state.recruitment.recruitableHeroes = [];
  for (let i = 0; i < 6; i++) {
    let hero: GameHero = createHero();

    if (succeedsChance(1)) {
      const specialHero = getRandomSpecialHero(recruitSeed + '-' + i);
      if (!doesHeroExist(specialHero)) {
        hero = createSpecialHero(specialHero.id) ?? createHero();
        notify(`${hero.name} has come into town!`, 'Recruitment');
      }
    }

    hero.stats.force += statBonusForRecruit('force');
    hero.stats.piety += statBonusForRecruit('piety');
    hero.stats.progress += statBonusForRecruit('progress');
    hero.stats.resistance += statBonusForRecruit('resistance');
    hero.stats.speed += statBonusForRecruit('speed');

    state.recruitment.recruitableHeroes.push(hero);
  }

  setGameState(state);
}

export function recruitHero(hero: GameHero, index: number): void {
  const resource = getEntry<GameResource>('Food');
  if (!resource) return;

  const state = gamestate();

  if (!state.recruitment.recruitableHeroes.includes(hero)) {
    notifyError('That hero is not available for recruitment!', true);
    return;
  }

  loseResource(resource, recruitCost());
  addHero(hero);

  updateGamestate((state) => {
    state.recruitment.recruitableHeroes[index] = undefined;
    return state;
  });
}

export function doRecruitReroll(): void {
  const resource = getEntry<GameResource>('Food');
  if (!resource) return;

  generateHeroesToRecruit();
  loseResource(resource, recruitRerollCost());

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

export function canRerollRecruit(): boolean {
  const resource = getEntry<GameResource>('Food');
  if (!resource) return false;

  return hasResource(resource, recruitRerollCost());
}

export function recruitRerollCost(): number {
  const numRerolls = gamestate().recruitment.numRerolls ?? 0;
  if (numRerolls === 0) return 0;

  const totalRerolls = 1 + numRerolls;
  return recruitCost() + Math.floor(Math.pow(totalRerolls, 1.5)) * 5;
}

export function recruitCost(): number {
  const heroesRecruited = totalHeroes();
  return Math.floor(Math.pow(heroesRecruited, 1.9) * 5);
}
