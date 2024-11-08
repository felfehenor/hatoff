import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PageCardComponent } from '../../components/page-card/page-card.component';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [PageCardComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss',
})
export class OptionsComponent {
  public readonly tabs = [
    { name: 'Savefile', link: 'savefile' },
    { name: 'Notiifcations', link: 'notifications' },
  ];
}
