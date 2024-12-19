import { Component, computed, OnInit } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { startCase } from 'lodash';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { PetActionsComponent } from '../../components/pet-actions/pet-actions.component';
import { PetStatsComponent } from '../../components/pet-stats/pet-stats.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  canAttackTown,
  ensurePetName,
  gamestate,
  isPetPet,
  notifyError,
  petPet,
  renamePet,
  setPetRole,
} from '../../helpers';
import { PetRole } from '../../interfaces';

@Component({
  selector: 'app-game-pet',
  imports: [
    PageCardComponent,
    AnalyticsClickDirective,
    TippyDirective,
    SweetAlert2Module,
    CountdownComponent,
    PetStatsComponent,
    PetActionsComponent,
  ],
  templateUrl: './game-pet.component.html',
  styleUrl: './game-pet.component.scss',
})
export class GamePetComponent implements OnInit {
  public petName = computed(() => gamestate().pet.name);
  public petRole = computed(() => gamestate().pet.role);
  public canPetDefend = computed(() => canAttackTown());
  public canPetPet = computed(() => !isPetPet());
  public secondsOfPetBuff = computed(
    () => gamestate().cooldowns.nextPetPetTime,
  );
  public shouldShowCountdown = computed(() => this.secondsOfPetBuff() > 0);

  ngOnInit() {
    ensurePetName();
  }

  public setPetRole(newRole: PetRole) {
    setPetRole(newRole);
  }

  public renamePet(newName: string) {
    const name = startCase(newName.replace(/[^A-Za-z ]+/g, ''));
    if (name.length === 0) {
      notifyError('That name is not valid!', true);
      return;
    }

    renamePet(name);
  }

  public petPet() {
    petPet();
  }
}
