import { TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBolt,
  tablerClock,
  tablerHeart,
  tablerProgressBolt,
  tablerShield,
} from '@ng-icons/tabler-icons';
import { usedContentIcons } from '../../helpers';
import { GameEquipment, GameHeroStat } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';
import { RarityTextComponent } from '../rarity-text/rarity-text.component';

@Component({
  selector: 'app-equipment-display',
  imports: [
    NgIconComponent,
    TitleCasePipe,
    RarityTextComponent,
    ContentNameComponent,
  ],
  providers: [
    provideIcons({
      ...usedContentIcons(),
      tablerHeart,
      tablerProgressBolt,
      tablerBolt,
      tablerShield,
      tablerClock,
    }),
  ],
  templateUrl: './equipment-display.component.html',
  styleUrl: './equipment-display.component.scss',
})
export class EquipmentDisplayComponent {
  public item = input.required<GameEquipment>();

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
      name: 'speed',
      icon: 'tablerClock',
      tooltip: 'How quickly this hero applies damage to a task.',
      color: '#e4a700',
    },
  ];
}
