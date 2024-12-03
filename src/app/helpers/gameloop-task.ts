import { sumBy } from 'lodash';
import { GameTask } from '../interfaces';
import { heroHealFirstInjury } from './attribute';
import { getEntriesByType } from './content';
import { reduceStun } from './hero';
import { heroesAllocatedToTask } from './task';
import { purchasedUpgradesForTask } from './upgrade';

export function doTaskGameloop(ticks: number) {
  const unstunTasks = getEntriesByType<GameTask>('task').filter(
    (t) => t.slowlyRevivesHeroes,
  );
  unstunTasks.forEach((task) => {
    const allRehabs = heroesAllocatedToTask(task);
    const totalTicks =
      (task.resourceRewardPerCycle ?? 0) +
      sumBy(purchasedUpgradesForTask(task), (u) => u.boostResourceGain ?? 0);

    allRehabs.forEach((hero) => {
      reduceStun(hero, totalTicks * ticks);
      heroHealFirstInjury(hero, totalTicks * ticks);
    });
  });
}
