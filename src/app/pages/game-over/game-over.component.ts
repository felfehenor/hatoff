import { Component, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { gameOverReason, setDiscordStatus } from '../../helpers';

@Component({
  selector: 'app-game-over',
  imports: [RouterLink, AnalyticsClickDirective],
  templateUrl: './game-over.component.html',
  styleUrl: './game-over.component.scss',
})
export class GameOverComponent implements OnInit {
  public gameOverReason = computed(() => gameOverReason() || 'Your main hero perished in unknown circumstances.');

  ngOnInit() {
    setDiscordStatus({
      state: 'Game Over',
    });
  }
}
