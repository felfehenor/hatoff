import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConnectButtonsComponent } from '../../components/connect-buttons/connect-buttons.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { isSetup } from '../../helpers';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ConnectButtonsComponent, AnalyticsClickDirective],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public meta = inject(MetaService);

  public hasStartedGame = computed(() => isSetup());
}
