import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { ConnectButtonsComponent } from '../../components/connect-buttons/connect-buttons.component';
import { isSetup } from '../../helpers';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIconComponent, ConnectButtonsComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public meta = inject(MetaService);

  public hasStartedGame = computed(() => isSetup());
}
