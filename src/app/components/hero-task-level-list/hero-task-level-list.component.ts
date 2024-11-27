import { Component, computed, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { HeroTaskLevelDisplayComponent } from '../hero-task-level-display/hero-task-level-display.component';

@Component({
    selector: 'app-hero-task-level-list',
    imports: [HeroTaskLevelDisplayComponent],
    templateUrl: './hero-task-level-list.component.html',
    styleUrl: './hero-task-level-list.component.scss'
})
export class HeroTaskLevelListComponent {
  public hero = input.required<GameHero>();

  public allHeroTaskLevels = computed(() =>
    Object.keys(this.hero().taskLevels),
  );
}
