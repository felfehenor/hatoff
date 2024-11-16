import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrandDiscord,
  tablerMail,
  tablerRss,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { ChangelogModalComponent } from '../changelog-modal/changelog-modal.component';

@Component({
  selector: 'app-connect-buttons',
  standalone: true,
  imports: [NgIconComponent, TippyDirective, ChangelogModalComponent],
  providers: [
    provideIcons({
      tablerBrandDiscord,
      tablerMail,
      tablerRss,
    }),
  ],
  templateUrl: './connect-buttons.component.html',
  styleUrl: './connect-buttons.component.scss',
})
export class ConnectButtonsComponent {
  public readonly externalLinks = [
    {
      name: 'Discord',
      link: 'https://discord.felfhenor.com',
      color: '#5865f2',
      currentColor: '#ccc',
      icon: 'tablerBrandDiscord',
    },
    {
      name: 'Blog',
      link: 'https://blog.felfhenor.com',
      color: '#e37418',
      currentColor: '#ccc',
      icon: 'tablerRss',
    },
    {
      name: 'Email',
      link: 'mailto:support@felfhenor.com',
      color: '#ce00ce',
      currentColor: '#ccc',
      icon: 'tablerMail',
    },
  ];
}
