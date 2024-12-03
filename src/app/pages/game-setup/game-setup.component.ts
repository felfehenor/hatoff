import { TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SavefileImportComponent } from '../../components/savefile-import/savefile-import.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { difficultyDescription, finishSetup, isSetup } from '../../helpers';
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
    easy: difficultyDescription('easy'),
    normal: difficultyDescription('normal'),
    hard: difficultyDescription('hard'),
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
