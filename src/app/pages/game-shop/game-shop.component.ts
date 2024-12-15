import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { timer } from 'rxjs';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { ShopItemListComponent } from '../../components/shop-item-list/shop-item-list.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { HideResearchDirective } from '../../directives/hideresearch.directive';
import {
  canRerollShop,
  doShopReroll,
  gamestate,
  rerollShopCost,
} from '../../helpers';

@Component({
  selector: 'app-game-shop',
  imports: [
    PageCardComponent,
    DecimalPipe,
    ShopItemListComponent,
    CountdownComponent,
    AnalyticsClickDirective,
    HideResearchDirective,
    RouterLink,
  ],
  templateUrl: './game-shop.component.html',
  styleUrl: './game-shop.component.scss',
})
export class GameShopComponent {
  public canReroll = computed(
    () => canRerollShop() && !this.isRerollOnTimeout(),
  );
  public rerollCost = computed(() => rerollShopCost());
  public secondsUntilReset = computed(
    () => gamestate().cooldowns.nextShopResetTime,
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
