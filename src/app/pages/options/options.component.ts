import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { options } from '../../helpers';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [PageCardComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent {
  public readonly tabs = [
    {
      name: 'UI',
      link: 'ui',
      showIf: computed(() => true),
    },
    { name: 'Savefile', link: 'savefile', showIf: computed(() => true) },
    {
      name: 'Notifications',
      link: 'notifications',
      showIf: computed(() => true),
    },
    {
      name: 'Debug',
      link: 'debug',
      showIf: computed(() => options().showDebug),
    },
  ];
}
