import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  blankGameState,
  gamestate,
  notifySuccess,
  setGameState,
} from '../../helpers';
import { GameState } from '../../interfaces';

@Component({
  selector: 'app-options-savefile',
  standalone: true,
  imports: [SweetAlert2Module, DatePipe, DecimalPipe],
  templateUrl: './options-savefile.component.html',
  styleUrl: './options-savefile.component.scss',
})
export class OptionsSavefileComponent {
  private router = inject(Router);

  public startedAt = computed(() => gamestate().meta.createdAt);
  public numTicks = computed(() => gamestate().meta.numTicks);

  exportSavefile() {
    const state = gamestate();

    const fileName = `${state.townSetup.heroName}-${Date.now()}.hatoff`;
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', fileName);
    downloadAnchorNode.click();
  }

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

      finish();

      notifySuccess(`Successfully imported ${charFile.townSetup.heroName}!`);
    };

    reader.readAsText(file);
  }

  async deleteSavefile() {
    await this.router.navigate(['/']);

    setGameState(blankGameState());
  }
}
