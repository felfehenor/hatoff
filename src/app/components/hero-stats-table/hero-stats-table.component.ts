import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { AllGameHeroStats, GameHero, GameHeroStat } from '../../interfaces';

@Component({
  selector: 'app-hero-stats-table',
  standalone: true,
  imports: [TitleCasePipe, DecimalPipe, TippyDirective],
  templateUrl: './hero-stats-table.component.html',
  styleUrl: './hero-stats-table.component.scss',
})
export class HeroStatsTableComponent {
  public hero = input.required<GameHero>();

  public readonly gameStats: GameHeroStat[] = AllGameHeroStats;
  public readonly statTooltips: string[] = [
    'How long this hero can survive in combat.',
    'How much task XP this hero gets upon finishing a task cycle.',
    'How much damage this hero applies to a task.',
    'How much damage reduction this hero gets in combat, as well as other uses.',
    'How likely it is for this hero to resurrect in combat, as well as other uses.',
    'How quickly this hero applies damage to a task.',
  ];
}
