import { TitleCasePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import {
  currentDifficulty,
  difficultyDescription,
  gamestate,
} from '../../helpers';

const townInfo: Record<string, string> = {
  Rosebud: 'Start with 5,000 of all resources.',
  Simpletown: 'Easy mode: No town defense.',
  'Fel Fhenor': 'Hard mode.',
};

@Component({
  selector: 'app-town-info-card',
  imports: [TitleCasePipe],
  templateUrl: './town-info-card.component.html',
  styleUrl: './town-info-card.component.scss',
})
export class TownInfoCardComponent {
  public townName = computed(() => gamestate().townSetup.townName);
  public customText = computed(() => townInfo[this.townName()]);

  public currentDifficulty = computed(() => currentDifficulty());
  public difficultyText = computed(() =>
    difficultyDescription(this.currentDifficulty()),
  );
}
