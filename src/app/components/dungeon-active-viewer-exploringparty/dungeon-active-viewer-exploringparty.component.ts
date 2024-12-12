import { Component, computed } from '@angular/core';
import { gamestate } from '../../helpers';
import { GameActiveCombatant } from '../../interfaces';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';

@Component({
  selector: 'app-dungeon-active-viewer-exploringparty',
  imports: [HeroArtComponent, DamageTypeComponent],
  templateUrl: './dungeon-active-viewer-exploringparty.component.html',
  styleUrl: './dungeon-active-viewer-exploringparty.component.scss',
})
export class DungeonActiveViewerExploringpartyComponent {
  public explorerParty = computed(
    () => gamestate().exploration.exploringParty as GameActiveCombatant[],
  );
}
