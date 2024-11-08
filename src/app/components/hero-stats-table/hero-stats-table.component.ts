import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AllGameHeroStats, GameHero, GameHeroStat } from '../../interfaces';

@Component({
  selector: 'app-hero-stats-table',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe],
  templateUrl: './hero-stats-table.component.html',
  styleUrl: './hero-stats-table.component.scss',
})
export class HeroStatsTableComponent {
  public hero = input.required<GameHero>();

  public readonly gameStats: GameHeroStat[] = AllGameHeroStats;
}
