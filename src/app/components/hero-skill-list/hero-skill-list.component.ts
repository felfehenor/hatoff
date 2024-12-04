import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  allSkillsForHero,
  usableSkillsForHero,
  usedContentIcons,
} from '../../helpers';
import { GameHero, GameSkill } from '../../interfaces';
import { BlurCardComponent } from '../blur-card/blur-card.component';
import { ButtonCloseComponent } from '../button-close/button-close.component';

@Component({
  selector: 'app-hero-skill-list',
  imports: [ButtonCloseComponent, NgIconComponent, BlurCardComponent],
  providers: [provideIcons(usedContentIcons())],
  templateUrl: './hero-skill-list.component.html',
  styleUrl: './hero-skill-list.component.scss',
})
export class HeroSkillListComponent {
  public hero = input.required<GameHero>();
  public close = output<void>();

  public usableSkills = computed(() => {
    return usableSkillsForHero(this.hero());
  });

  public allSkills = computed(() => {
    return allSkillsForHero(this.hero());
  });

  public isSkillUsable(skill: GameSkill): boolean {
    return this.usableSkills().includes(skill);
  }
}
