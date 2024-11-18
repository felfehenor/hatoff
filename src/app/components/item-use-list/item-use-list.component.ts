import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  gamestate,
  getEntriesByType,
  usedItemIcons,
  useItemOnHero,
} from '../../helpers';
import { GameHero, GameItem } from '../../interfaces';
import { ButtonCloseComponent } from '../button-close/button-close.component';

@Component({
  selector: 'app-item-use-list',
  standalone: true,
  imports: [ButtonCloseComponent, NgIconComponent],
  providers: [provideIcons(usedItemIcons())],
  templateUrl: './item-use-list.component.html',
  styleUrl: './item-use-list.component.scss',
})
export class ItemUseListComponent {
  public hero = input.required<GameHero>();
  public close = output<void>();

  public usableItems = computed(() => {
    const state = gamestate();
    return getEntriesByType<GameItem>('item')
      .filter((t) => state.shop.ownedItems[t.id] > 0)
      .map((item) => ({ quantity: state.shop.ownedItems[item.id], item }));
  });

  public useItem(item: GameItem) {
    useItemOnHero(this.hero(), item);
  }
}
