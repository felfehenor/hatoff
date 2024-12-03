import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';

@Component({
  selector: 'app-game-over',
  imports: [RouterLink, AnalyticsClickDirective],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent {}
