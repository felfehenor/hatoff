import { Component, computed, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry } from '../../helpers';
import { GameHero, GameTask } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-hero-task-level-display',
  standalone: true,
  imports: [ContentNameComponent, TippyDirective],
  templateUrl: './hero-task-level-display.component.html',
  styleUrl: './hero-task-level-display.component.scss',
})
export class HeroTaskLevelDisplayComponent {
  public id = input.required<string>();
  public hero = input.required<GameHero>();

  public correspondingTask = computed(() => getEntry<GameTask>(this.id()));
  public shouldDisplay = computed(
    () => this.level() > 0 && this.correspondingTask(),
  );
  public level = computed(() => this.hero().taskLevels[this.id()]);
  public text = computed(() => `Lv. ${this.level()}`);
  public description = computed(() =>
    this.level() >= (this.correspondingTask()?.maxLevel ?? 0)
      ? 'Max Level'
      : `${this.hero().taskXp[this.id()]}/${
          this.correspondingTask()?.xpRequiredPerLevel ?? 0
        } XP`,
  );
}
