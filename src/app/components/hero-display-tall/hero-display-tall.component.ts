import { Component, computed, input, output } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  canGiveClickXp,
  clickXpBoost,
  gamestate,
  getHero,
  giveClickXp,
  removeHero,
  setHeroDamageType,
} from '../../helpers';
import { GameHero } from '../../interfaces';
import { ButtonCloseComponent } from '../button-close/button-close.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroAssignmentComponent } from '../hero-assignment/hero-assignment.component';
import { HeroLevelTaglineComponent } from '../hero-level-tagline/hero-level-tagline.component';
import { HeroStatsTableComponent } from '../hero-stats-table/hero-stats-table.component';
import { HeroTaskLevelListComponent } from '../hero-task-level-list/hero-task-level-list.component';

@Component({
  selector: 'app-hero-display-tall',
  standalone: true,
  imports: [
    DamageTypeComponent,
    HeroArtComponent,
    HeroArchetypeListComponent,
    HeroStatsTableComponent,
    HeroAssignmentComponent,
    HeroLevelTaglineComponent,
    HeroTaskLevelListComponent,
    SweetAlert2Module,
    ButtonCloseComponent,
    TippyDirective,
  ],
  templateUrl: './hero-display-tall.component.html',
  styleUrl: './hero-display-tall.component.scss',
})
export class HeroDisplayTallComponent {
  public hero = input.required<GameHero>();
  public close = output<void>();

  public liveHeroData = computed(() => getHero(this.hero().id));

  public canEditHeroStats = computed(
    () => this.hero()?.id === gamestate().townSetup.heroId,
  );

  public canDismissHero = computed(
    () => this.hero().id !== gamestate().townSetup.heroId,
  );

  public xpOnClick = computed(() => clickXpBoost());

  public changeMainCharacterType(newType: string) {
    const hero = this.hero();
    if (!hero) return;

    setHeroDamageType(hero, newType);
  }

  public dismissHero() {
    removeHero(this.hero());
    this.close.emit();
  }

  public canGiveClickXp(): boolean {
    return (
      Date.now() >= gamestate().cooldowns.nextClickResetTime && canGiveClickXp()
    );
  }

  public giveXp() {
    giveClickXp(this.hero());
  }
}
