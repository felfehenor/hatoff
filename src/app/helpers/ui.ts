import { GameDamageType, GameTask } from '../interfaces';
import { getEntry } from './content';
import { gamestate } from './gamestate';
import { isStunned } from './hero';
import { isResearchComplete } from './research';
import { heroesAllocatedToTask } from './task';

export function baseCardClasses() {
  return [
    'sm:min-w-[45%]',
    'sm:max-w-[45%]',
    'lg:min-w-[30%]',
    'lg:max-w-[30%]',
    'xl:min-w-[23%]',
    'xl:max-w-[23%]',
  ];
}

export function halfCardClasses() {
  return [
    'sm:min-w-[95%]',
    'sm:max-w-[95%]',
    'md:min-w-[95%]',
    'md:max-w-[95%]',
    'lg:min-w-[45%]',
    'lg:max-w-[45%]',
  ];
}

export function taskErrors(task: GameTask): string | undefined {
  // sovereign, and anything like it
  if (task.spreadHeroDamageType) {
    const heroes = heroesAllocatedToTask(task).filter(
      (f) => getEntry<GameDamageType>(f.damageTypeId)?.isAny,
    );
    if (heroes.length > 0) return 'Any has no effect here.';
  }

  // church/school
  if (task.siblingTaskIdRequiringHeroesAllocated) {
    const myHeroes = heroesAllocatedToTask(task);
    const otherTask = getEntry<GameTask>(
      task.siblingTaskIdRequiringHeroesAllocated,
    )!;
    const heroes = heroesAllocatedToTask(otherTask);
    if (myHeroes.length > 0 && heroes.length === 0)
      return `${otherTask.name} needs heroes allocated to it for this one to operate.`;
  }

  // research
  if (task.applyResultsToResearch) {
    if (
      !gamestate().activeResearch ||
      isResearchComplete(gamestate().activeResearch)
    )
      return 'You are not currently researching anything.';
  }

  // heal/etc
  if (task.slowlyRevivesHeroes) {
    const heroes = heroesAllocatedToTask(task)
      .filter((f) => !isStunned(f))
      .map((f) => f.name);
    if (heroes.length > 0)
      return `The following heroes are not stunned: ${heroes.join(', ')}.`;
  }

  return undefined;
}
