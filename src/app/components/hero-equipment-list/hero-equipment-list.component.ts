import { Component, computed, input } from '@angular/core';
import { getHeroEquipmentList } from '../../helpers';
import { GameHero } from '../../interfaces';
import { EquipmentDisplayComponent } from '../equipment-display/equipment-display.component';

@Component({
  selector: 'app-hero-equipment-list',
  imports: [EquipmentDisplayComponent],
  templateUrl: './hero-equipment-list.component.html',
  styleUrl: './hero-equipment-list.component.scss',
})
export class HeroEquipmentListComponent {
  public hero = input.required<GameHero>();

  public heroEquipment = computed(() => getHeroEquipmentList(this.hero()));
}
