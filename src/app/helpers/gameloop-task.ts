import { sumBy } from 'lodash';
import { GameTask } from '../interfaces';
import { getEntry } from './content';
import { reduceStun } from './hero';
import { heroesAllocatedToTask } from './task';
import { purchasedUpgradesForTask } from './upgrade';

export function doTaskGameloop(ticks: number) {
  const task = getEntry<GameTask>('Healer');
  if (task) {
    const allRehabs = heroesAllocatedToTask(task);
    const totalTicks =
      (task.resourceRewardPerCycle ?? 0) +
      sumBy(purchasedUpgradesForTask(task), (u) => u.boostResourceGain ?? 0);

    allRehabs.forEach((hero) => reduceStun(hero, totalTicks * ticks));
  }
}
