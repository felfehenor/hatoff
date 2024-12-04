import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameSkillTargetting {
  targets: number;
  type: 'enemy' | 'ally';
  replace?: boolean;
  allowDead?: boolean;
}

export interface GameSkillScalar {
  stat: GameHeroStat;
  percent: number;
}

export interface GameSkill extends Content {
  description: string;

  icon: string;
  color: string;

  requireDamageTypeId?: string;
  cooldown: number;
  accuracy: number;
  targetting: GameSkillTargetting;
  scalars: GameSkillScalar[];
}
