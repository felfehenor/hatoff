import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBolt,
  tablerClock,
  tablerCloud,
  tablerHeart,
  tablerProgressBolt,
  tablerShield,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { GameHero, GameHeroStat } from '../../interfaces';

@Component({
    selector: 'app-hero-stats-table',
    imports: [TitleCasePipe, DecimalPipe, TippyDirective, NgIconComponent],
    providers: [
        provideIcons({
            tablerHeart,
            tablerProgressBolt,
            tablerBolt,
            tablerShield,
            tablerCloud,
            tablerClock,
        }),
    ],
    templateUrl: './hero-stats-table.component.html',
    styleUrl: './hero-stats-table.component.scss'
})
export class HeroStatsTableComponent {
  public hero = input.required<GameHero>();

  public readonly stats: Array<{
    name: GameHeroStat;
    icon: string;
    tooltip: string;
    color: string;
  }> = [
    {
      name: 'health',
      icon: 'tablerHeart',
      tooltip: 'How long this hero can survive in combat.',
      color: '#a00',
    },
    {
      name: 'progress',
      icon: 'tablerProgressBolt',
      tooltip: 'How much task XP this hero gets upon finishing a task cycle.',
      color: '#a0f6a3',
    },
    {
      name: 'force',
      icon: 'tablerBolt',
      tooltip: 'How much damage this hero applies to a task.',
      color: '#e501b0',
    },
    {
      name: 'resistance',
      icon: 'tablerShield',
      tooltip:
        'How much damage reduction this hero gets in combat, as well as other uses.',
      color: '#fd88e2',
    },
    {
      name: 'piety',
      icon: 'tablerCloud',
      tooltip:
        'How likely it is for this hero to resurrect in combat, as well as other uses.',
      color: '#87ceeb',
    },
    {
      name: 'speed',
      icon: 'tablerClock',
      tooltip: 'How quickly this hero applies damage to a task.',
      color: '#e4a700',
    },
  ];
}
