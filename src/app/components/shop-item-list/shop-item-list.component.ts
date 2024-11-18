import { NgClass } from '@angular/common';
import { Component, computed } from '@angular/core';
import {
  buyItem,
  canBuyItemFromShop,
  gamestate,
  getEntry,
} from '../../helpers';
import { GameItem } from '../../interfaces';
import { ShopItemDisplayComponent } from '../shop-item-display/shop-item-display.component';

@Component({
  selector: 'app-shop-item-list',
  standalone: true,
  imports: [ShopItemDisplayComponent, NgClass],
  templateUrl: './shop-item-list.component.html',
  styleUrl: './shop-item-list.component.scss',
})
export class ShopItemListComponent {
  public allShopItems = computed(() =>
    gamestate().shop.shopItems.map((i) => getEntry<GameItem>(i!)),
  );

  public cardClasses = computed(() => {
    return [
      'sm:min-w-[45%]',
      'sm:max-w-[45%]',
      'lg:min-w-[30%]',
      'lg:max-w-[30%]',
      'xl:min-w-[23%]',
      'xl:max-w-[23%]',
    ];
  });

  public canBuyItem(item: GameItem): boolean {
    return canBuyItemFromShop(item);
  }

  public buyItem(item: GameItem, index: number): void {
    buyItem(item, index);
  }
}
