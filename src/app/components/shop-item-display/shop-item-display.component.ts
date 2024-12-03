import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { canBuyItemFromShop, usedContentIcons } from '../../helpers';
import { GameItem } from '../../interfaces';

@Component({
  selector: 'app-shop-item-display',
  imports: [DecimalPipe, NgIconComponent, AnalyticsClickDirective],
  providers: [provideIcons(usedContentIcons())],
  templateUrl: './shop-item-display.component.html',
  styleUrl: './shop-item-display.component.scss',
})
export class ShopItemDisplayComponent {
  public item = input.required<GameItem>();
  public buy = output<void>();

  public canBuy = computed(() => {
    return canBuyItemFromShop(this.item());
  });
}
