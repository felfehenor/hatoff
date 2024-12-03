import { NgClass } from '@angular/common';
import { Component, computed } from '@angular/core';
import {
  baseCardClasses,
  buyItem,
  canBuyItemFromShop,
  gamestate,
  getEntry,
} from '../../helpers';
import { GameItem } from '../../interfaces';
import { ShopItemDisplayComponent } from '../shop-item-display/shop-item-display.component';

@Component({
  selector: 'app-shop-item-list',
  imports: [ShopItemDisplayComponent, NgClass],
  templateUrl: './shop-item-list.component.html',
  styleUrl: './shop-item-list.component.scss',
})
export class ShopItemListComponent {
  public allShopItems = computed(() =>
    gamestate().shop.shopItems.map((i) => getEntry<GameItem>(i!)),
  );

  public cardClasses = computed(() => {
    return baseCardClasses();
  });

  public canBuyItem(item: GameItem): boolean {
    return canBuyItemFromShop(item);
  }

  public buyItem(item: GameItem, index: number): void {
    buyItem(item, index);
  }
}
