import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SavefileImportComponent } from '../../components/savefile-import/savefile-import.component';
import { finishSetup, isSetup } from '../../helpers';

@Component({
  selector: 'app-game-setup',
  standalone: true,
  imports: [RouterLink, FormsModule, SavefileImportComponent],
  templateUrl: './game-setup.component.html',
  styleUrl: './game-setup.component.scss',
})
export class GameSetupComponent implements OnInit {
  private router = inject(Router);

  public heroName = signal<string>('');
  public townName = signal<string>('');

  public canSubmit = computed(() => this.heroName() && this.townName());

  ngOnInit() {
    if (isSetup()) {
      this.router.navigate(['/game/town']);
    }
  }

  public play() {
    if (!this.canSubmit()) return;

    finishSetup(this.heroName(), this.townName());
    this.router.navigate(['/game/town']);
  }
}
