import { Component, computed, input } from '@angular/core';
import { rarityColor } from '../../helpers';
import { EquipmentRarity } from '../../interfaces';

@Component({
  selector: 'app-rarity-text',
  imports: [],
  templateUrl: './rarity-text.component.html',
  styleUrl: './rarity-text.component.scss',
})
export class RarityTextComponent {
  public rarity = input.required<EquipmentRarity>();

  public rarityColor = computed(() => rarityColor(this.rarity()));
}
