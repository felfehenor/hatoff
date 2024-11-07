import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isSetup } from '../../helpers';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public hasStartedGame = computed(() => isSetup());
}
