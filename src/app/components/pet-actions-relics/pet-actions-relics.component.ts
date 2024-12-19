import { TitleCasePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import {
  canEquipMoreRelics,
  equipRelic,
  gamestate,
  petEquippableRelics,
  petMultiplierForStat,
  unequipRelic,
} from '../../helpers';
import { GameLoot, PetStat } from '../../interfaces';

@Component({
  selector: 'app-pet-actions-relics',
  imports: [TitleCasePipe],
  templateUrl: './pet-actions-relics.component.html',
  styleUrl: './pet-actions-relics.component.scss',
})
export class PetActionsRelicsComponent {
  public equippableRelics = computed(() => petEquippableRelics());
  public canEquipMoreRelics = computed(() => canEquipMoreRelics());

  public relicStats(relic: GameLoot): Array<{ stat: PetStat; value: number }> {
    return Object.keys(relic.statBoosts ?? {}).map((statKey) => ({
      stat: statKey as PetStat,
      value:
        (relic.statBoosts[statKey as PetStat] ?? 0) *
        petMultiplierForStat(statKey as PetStat),
    }));
  }

  public isRelicSelected(relic: GameLoot): boolean {
    return gamestate().pet.equippedRelics.includes(relic.id);
  }

  public selectRelic(relic: GameLoot) {
    if (this.isRelicSelected(relic)) {
      unequipRelic(relic);
      return;
    }

    equipRelic(relic);
  }
}
