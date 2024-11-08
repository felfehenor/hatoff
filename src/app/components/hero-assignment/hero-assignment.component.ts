import { Component, computed, input } from '@angular/core';
import { currentHeroTask } from '../../helpers';
import { GameHero } from '../../interfaces';

@Component({
  selector: 'app-hero-assignment',
  standalone: true,
  imports: [],
  templateUrl: './hero-assignment.component.html',
  styleUrl: './hero-assignment.component.scss',
})
export class HeroAssignmentComponent {
  public hero = input.required<GameHero>();

  public currentHeroTask = computed(() => currentHeroTask(this.hero())?.name);
}
