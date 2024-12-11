import { sample } from 'lodash';
import { GameResource } from '../interfaces';
import { getEntry } from './content';
import { gamestate } from './gamestate';
import { getPetStat } from './pet';
import { isResearchComplete } from './research';
import { gainResource } from './resource';

function doGatherer(ticks: number) {
  const possibleResources = [
    getEntry<GameResource>('Gold'),
    getEntry<GameResource>('Wood'),
    getEntry<GameResource>('Stone'),
    getEntry<GameResource>('Food'),
  ].filter(Boolean);
  const amount = getPetStat('force') * ticks;

  const res = sample(possibleResources);
  if (!res || amount < 1) return;
  gainResource(res, amount);
}

function doDefender(ticks: number) {
  const res = getEntry<GameResource>('Fortifications');
  const amount = getPetStat('resistance') * ticks;

  if (!res || amount < 1) return;
  gainResource(res, amount);
}

export function doPetGameloop(ticks: number) {
  if (!gamestate().pet || !isResearchComplete('Town Pet')) return;
  if (gamestate().pet.role === 'gatherer') doGatherer(ticks);
  if (gamestate().pet.role === 'defender') doDefender(ticks);
}
