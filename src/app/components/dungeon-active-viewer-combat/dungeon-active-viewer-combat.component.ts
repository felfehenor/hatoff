import { Component, computed } from '@angular/core';
import { gamestate } from '../../helpers';
import { BlankSlateComponent } from '../blank-slate/blank-slate.component';
import { HeroDamageTypeComponent } from '../hero-damage-type/hero-damage-type.component';

@Component({
  selector: 'app-dungeon-active-viewer-combat',
  imports: [HeroDamageTypeComponent, BlankSlateComponent],
  templateUrl: './dungeon-active-viewer-combat.component.html',
  styleUrl: './dungeon-active-viewer-combat.component.scss',
})
export class DungeonActiveViewerCombatComponent {
  public messages = computed(
    () => gamestate().exploration.currentCombat?.combatMessages ?? [],
  );

  public defenders = computed(
    () => gamestate().exploration.currentCombat?.defenders ?? [],
  );
}
