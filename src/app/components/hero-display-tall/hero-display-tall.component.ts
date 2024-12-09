import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerTag } from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { startCase } from 'lodash';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { HeroSpecialGlowDirective } from '../../directives/hero-special-glow.directive';
import { HideResearchDirective } from '../../directives/hideresearch.directive';
import {
  canGiveClickXp,
  canUseItemsOnHero,
  clickXpBoost,
  gamestate,
  getEntry,
  getHero,
  giveClickXp,
  hasAnyitemsToUse,
  heroStatValue,
  notifyError,
  removeHero,
  renameHero,
  setHeroDamageType,
  unassignHeroTask,
} from '../../helpers';
import { GameDamageType, GameHero } from '../../interfaces';
import { ButtonCloseComponent } from '../button-close/button-close.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroAssignmentComponent } from '../hero-assignment/hero-assignment.component';
import { HeroAttributeListComponent } from '../hero-attribute-list/hero-attribute-list.component';
import { HeroBuffListComponent } from '../hero-buff-list/hero-buff-list.component';
import { HeroLevelTaglineComponent } from '../hero-level-tagline/hero-level-tagline.component';
import { HeroStatsTableComponent } from '../hero-stats-table/hero-stats-table.component';
import { HeroStatusComponent } from '../hero-status/hero-status.component';
import { HeroTaskLevelListComponent } from '../hero-task-level-list/hero-task-level-list.component';

@Component({
  selector: 'app-hero-display-tall',
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
    HeroSpecialGlowDirective,
    HeroStatusComponent,
    HideResearchDirective,
    NgIconComponent,
    AnalyticsClickDirective,
    HeroAttributeListComponent,
    HeroBuffListComponent,
  ],
  providers: [
    provideIcons({
      tablerTag,
    }),
  ],
  templateUrl: './hero-display-tall.component.html',
  styleUrl: './hero-display-tall.component.scss',
})
export class HeroDisplayTallComponent {
  public hero = input.required<GameHero>();
  public close = output<void>();
  public showItemPanel = output<void>();
  public showSkillPanel = output<void>();

  public liveHeroData = computed(() => getHero(this.hero().id));

  public canEditHeroStats = computed(
    () => this.hero()?.id === gamestate().townSetup.heroId,
  );

  public canDismissHero = computed(
    () => this.hero().id !== gamestate().townSetup.heroId,
  );

  public xpOnClick = computed(() => clickXpBoost());

  public hasItems = computed(() => hasAnyitemsToUse());

  public canUseItemsOnThisHero = computed(() => canUseItemsOnHero(this.hero()));

  public heroForce = computed(() => heroStatValue(this.hero(), 'force'));

  public changeMainCharacterType(newType: string) {
    const hero = this.hero();
    if (!hero) return;

    setHeroDamageType(hero, newType);
    unassignHeroTask(hero);
  }

  public dismissHero() {
    removeHero(this.hero());
    this.close.emit();
  }

  public renameHero(newName: string) {
    const name = startCase(newName.replace(/[^A-Za-z ]+/g, ''));
    if (name.length === 0) {
      notifyError('That name is not valid!', true);
      return;
    }

    renameHero(this.hero().id, name);
  }

  public canGiveClickXp(): boolean {
    return gamestate().cooldowns.nextClickResetTime <= 0 && canGiveClickXp();
  }

  public giveXp() {
    giveClickXp(this.hero());
  }

  public heroDamageType(hero: GameHero): string {
    return getEntry<GameDamageType>(hero.damageTypeId)?.name ?? 'Unknown';
  }
}
