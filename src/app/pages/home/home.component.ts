import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrandDiscord,
  tablerMail,
  tablerRss,
} from '@ng-icons/tabler-icons';
import { isSetup } from '../../helpers';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIconComponent],
  providers: [
    provideIcons({
      tablerBrandDiscord,
      tablerMail,
      tablerRss,
    }),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public meta = inject(MetaService);

  public hasStartedGame = computed(() => isSetup());

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
