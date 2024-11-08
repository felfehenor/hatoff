import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { blankGameState, setGameState } from '../../helpers';

@Component({
  selector: 'app-options-savefile',
  standalone: true,
  imports: [SweetAlert2Module],
  templateUrl: './options-savefile.component.html',
  styleUrl: './options-savefile.component.scss',
})
export class OptionsSavefileComponent {
  private router = inject(Router);

  async deleteSavefile() {
    await this.router.navigate(['/']);

    setGameState(blankGameState());
  }
}
