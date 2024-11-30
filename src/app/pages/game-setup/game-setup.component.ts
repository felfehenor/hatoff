import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SavefileImportComponent } from '../../components/savefile-import/savefile-import.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { finishSetup, isSetup } from '../../helpers';
import { GameDifficulty } from '../../interfaces';

@Component({
  selector: 'app-game-setup',
  imports: [
    FormsModule,
    SavefileImportComponent,
    TitleCasePipe,
    AnalyticsClickDirective,
  ],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent implements OnInit {
  private router = inject(Router);

  public heroName = signal<string>('');
  public townName = signal<string>('');
  public gameDifficulty = signal<GameDifficulty>('normal');

  public canSubmit = computed(() => this.heroName() && this.townName());

  public readonly difficultyDescriptions: Record<GameDifficulty, string> = {
    easy: 'Easy peasy. Defend Town is disabled, leading to a more chill, idle game.',
    normal: 'The game as intended. No upscaling, no downscaling.',
    hard: 'Hard mode. Defend Town costs more, and all task types are strict assignment. Heroes will die permanently.',
  };

  public readonly difficulties: GameDifficulty[] = ['easy', 'normal', 'hard'];

  ngOnInit() {
    if (isSetup()) {
      this.router.navigate(['/game/town']);
    }
  }

  public play() {
    if (!this.canSubmit()) return;

    finishSetup(this.heroName(), this.townName(), this.gameDifficulty());
    this.router.navigate(['/game/town']);
  }
}
