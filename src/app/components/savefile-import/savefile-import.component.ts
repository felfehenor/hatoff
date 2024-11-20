import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { migrateGameState, notifySuccess, setGameState } from '../../helpers';
import { GameState } from '../../interfaces';

@Component({
  selector: 'app-savefile-import',
  standalone: true,
  imports: [],
  templateUrl: './savefile-import.component.html',
  styleUrl: './savefile-import.component.scss',
})
export class SavefileImportComponent {
  private router = inject(Router);

  importSavefile(e: Event) {
    const fileInput = e.target as HTMLInputElement;
    if (!e || !e.target || !fileInput.files) {
      return;
    }

    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.onload = (ev) => {
      const charFile = JSON.parse(
        (ev.target as FileReader).result as string,
      ) as GameState;

      const finish = () => {
        fileInput.value = '';
      };

      setGameState(charFile);
      migrateGameState();

      finish();

      notifySuccess(`Successfully imported ${charFile.townSetup.heroName}!`);

      this.router.navigate(['/game/town']);
    };

    reader.readAsText(file);
  }
}
