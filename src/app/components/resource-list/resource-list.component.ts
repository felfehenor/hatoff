import { Component, computed } from '@angular/core';
import { gamestate, getEntry, options } from '../../helpers';
import { ResourceDisplayComponent } from '../resource-display/resource-display.component';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [ResourceDisplayComponent],
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss',
})
export class ResourceListComponent {
  public resources = computed(() =>
    options().debugShowAllResources
      ? Object.keys(gamestate().resources).filter((k) => getEntry(k))
      : ['Gold', 'Wood', 'Stone', 'Food'],
  );
}
