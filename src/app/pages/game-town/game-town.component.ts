import { Component } from '@angular/core';
import { PageCardComponent } from '../../components/page-card/page-card.component';

@Component({
  selector: 'app-game-town',
  standalone: true,
  imports: [PageCardComponent],
  templateUrl: './game-town.component.html',
  styleUrl: './game-town.component.scss',
})
export class GameTownComponent {}
