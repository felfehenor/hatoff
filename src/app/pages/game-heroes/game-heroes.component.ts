import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';

@Component({
  selector: 'app-game-heroes',
  standalone: true,
  imports: [PageCardComponent, HeroListComponent, RouterLink],
  templateUrl: './game-heroes.component.html',
  styleUrl: './game-heroes.component.scss',
})
export class GameHeroesComponent {}
