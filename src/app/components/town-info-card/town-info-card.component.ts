import { Component, computed, HostBinding } from '@angular/core';
import { gamestate } from '../../helpers';

const townInfo: Record<string, string> = {
  Rosebud: 'Start with 5,000 of all resources.',
  'Fel Fhenor': 'All task types are strict assignments.',
};

@Component({
  selector: 'app-town-info-card',
  standalone: true,
  imports: [],
  templateUrl: './town-info-card.component.html',
  styleUrl: './town-info-card.component.scss',
})
export class TownInfoCardComponent {
  public townName = computed(() => gamestate().townSetup.townName);
  public customText = computed(() => townInfo[this.townName()]);

  @HostBinding('class.hidden')
  public get isHidden() {
    return !this.customText();
  }
}
