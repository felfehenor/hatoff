import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finishSetup } from '../../helpers';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent {
  private router = inject(Router);

  public heroName = signal<string>('');
  public townName = signal<string>('');

  public canSubmit = computed(() => this.heroName() && this.townName());

  public play() {
    if (!this.canSubmit()) return;

    finishSetup(this.heroName(), this.townName());
    this.router.navigate(['/game/town']);
  }
}
