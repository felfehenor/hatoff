import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerActivityHeartbeat } from '@ng-icons/tabler-icons';
import { currentHeroTask } from '../../helpers';
import { GameHero } from '../../interfaces';

@Component({
  selector: 'app-hero-assignment',
  imports: [NgIconComponent],
  providers: [
    provideIcons({
      tablerActivityHeartbeat,
    }),
  ],
  templateUrl: './hero-assignment.component.html',
  styleUrl: './hero-assignment.component.scss',
})
export class HeroAssignmentComponent {
  public hero = input.required<GameHero>();

  public currentHeroTask = computed(() => currentHeroTask(this.hero())?.name);
}
