import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { sortBy } from 'lodash';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  gamestate,
  getEntriesByType,
  usedContentIcons,
  useItemOnHero,
} from '../../helpers';
import { GameHero, GameItem } from '../../interfaces';
import { ButtonCloseComponent } from '../button-close/button-close.component';

@Component({
  selector: 'app-item-use-list',
  imports: [ButtonCloseComponent, NgIconComponent, AnalyticsClickDirective],
  providers: [provideIcons(usedContentIcons())],
  templateUrl: './item-use-list.component.html',
  styleUrl: './item-use-list.component.scss',
})
export class ItemUseListComponent {
  public hero = input.required<GameHero>();
  public close = output<void>();

  public usableItems = computed(() => {
    const state = gamestate();
    return sortBy(
      getEntriesByType<GameItem>('item')
        .filter((t) => state.shop.ownedItems[t.id] > 0)
        .map((item) => ({ quantity: state.shop.ownedItems[item.id], item })),
      (i) => i.item.name,
    );
  });

  public useItem(item: GameItem) {
    useItemOnHero(this.hero(), item);
  }
}
