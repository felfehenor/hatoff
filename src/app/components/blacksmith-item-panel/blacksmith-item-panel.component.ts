import { Component, computed, input, output, signal } from '@angular/core';
import {
  blacksmithRollCostFor,
  canBuyItem,
  canRollForItem,
  createBlacksmithItemFor,
  equipItemToHero,
  getEntry,
  getItemCost,
  loseResource,
} from '../../helpers';
import { GameEquipment, GameHero, GameResource } from '../../interfaces';
import { ButtonCloseComponent } from '../button-close/button-close.component';
import { EquipmentDisplayComponent } from '../equipment-display/equipment-display.component';
import { ResourceDisplayComponent } from '../resource-display/resource-display.component';

@Component({
  selector: 'app-blacksmith-item-panel',
  imports: [
    ButtonCloseComponent,
    EquipmentDisplayComponent,
    ResourceDisplayComponent,
  ],
  templateUrl: './blacksmith-item-panel.component.html',
  styleUrl: './blacksmith-item-panel.component.scss',
})
export class BlacksmithItemPanelComponent {
  public hero = input.required<GameHero>();
  public close = output<void>();

  public createdItem = signal<GameEquipment | undefined>(undefined);
  public toolCost = computed(() => blacksmithRollCostFor(this.hero()));
  public canPayCost = computed(() => canRollForItem(this.hero()));
  public canBuyItem = computed(() =>
    this.createdItem() ? canBuyItem(this.createdItem()!) : false,
  );
  public allItemCosts = computed(() => {
    const item = this.createdItem();
    if (!item) return [];

    const costs = getItemCost(item);
    return Object.keys(costs)
      .map((costKey) => {
        return {
          resource: costKey,
          cost: costs[costKey],
        };
      })
      .filter(Boolean);
  });

  public rollItem() {
    loseResource(getEntry<GameResource>('Metal Tools')!, this.toolCost());

    const newItem = createBlacksmithItemFor(this.hero());
    this.createdItem.set(newItem);
  }

  public buyItem() {
    const item = this.createdItem();
    if (!item) return;

    this.allItemCosts().forEach((cost) => {
      loseResource(getEntry<GameResource>(cost.resource)!, cost.cost);
    });

    equipItemToHero(this.hero(), item, 'primary');
    this.createdItem.set(undefined);
  }
}
