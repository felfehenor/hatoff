import { sumBy } from 'lodash';
import { GameHero } from '../interfaces';
import { cooldown } from './cooldown';
import { updateGamestate } from './gamestate';
import { gainXp } from './hero-xp';
import { allUnlockedClickXpResearch, isResearchComplete } from './research';

export function clickXpBoost(): number {
  return sumBy(allUnlockedClickXpResearch(), (r) => r.unlocksClickXpBonus ?? 0);
}

export function canGiveClickXp(): boolean {
  return isResearchComplete('Help From Above');
}

export function giveClickXp(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    state.cooldowns.nextClickResetTime = cooldown('nextClickResetTime');
    gainXp(heroRef, clickXpBoost());

    return state;
  });
}
