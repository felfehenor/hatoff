import { Component, computed, signal } from '@angular/core';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { allUnlockedPetSlotBoosts, gamestate } from '../../helpers';
import { PetActionsFeedHeroComponent } from '../pet-actions-feed-hero/pet-actions-feed-hero.component';
import { PetActionsFeedResourcesComponent } from '../pet-actions-feed-resources/pet-actions-feed-resources.component';
import { PetActionsRelicsComponent } from '../pet-actions-relics/pet-actions-relics.component';

type PetActionMode = 'feedpet' | 'feedhero' | 'equiprelics';

@Component({
  selector: 'app-pet-actions',
  imports: [
    AnalyticsClickDirective,
    PetActionsFeedResourcesComponent,
    PetActionsFeedHeroComponent,
    PetActionsRelicsComponent,
  ],
  templateUrl: './pet-actions.component.html',
  styleUrl: './pet-actions.component.scss',
})
export class PetActionsComponent {
  public petActionMode = signal<PetActionMode>('feedpet');

  public petEquippedRelics = computed(
    () => gamestate().pet.equippedRelics.length,
  );
  public petMaxRelics = computed(() => allUnlockedPetSlotBoosts());
}
