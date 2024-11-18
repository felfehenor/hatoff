import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { timer } from 'rxjs';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { ShopItemListComponent } from '../../components/shop-item-list/shop-item-list.component';
import {
  canRerollShop,
  doShopReroll,
  gamestate,
  rerollShopCost,
} from '../../helpers';

@Component({
  selector: 'app-game-shop',
  standalone: true,
  imports: [PageCardComponent, DecimalPipe, ShopItemListComponent],
  templateUrl: './game-shop.component.html',
  styleUrl: './game-shop.component.scss',
})
export class GameShopComponent {
  public canReroll = computed(
    () => canRerollShop() && !this.isRerollOnTimeout(),
  );
  public rerollCost = computed(() => rerollShopCost());
  public secondsUntilReset = computed(() =>
    Math.floor(
      ((gamestate().cooldowns.nextRecruitResetTime - Date.now()) / 1000) % 60,
    ),
  );
  public minutesUntilReset = computed(() =>
    Math.floor(
      (gamestate().cooldowns.nextRecruitResetTime - Date.now()) / 1000 / 60,
    ),
  );

  public isRerollOnTimeout = signal<boolean>(false);

  public doReroll(): void {
    doShopReroll();

    this.isRerollOnTimeout.set(true);
    timer(2000).subscribe(() => {
      this.isRerollOnTimeout.set(false);
    });
  }
}
