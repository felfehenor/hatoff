import { Component } from '@angular/core';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { OptionsBaseComponent } from '../options/option-base-page.component';

@Component({
  selector: 'app-options-notification',
  imports: [AnalyticsClickDirective],
  templateUrl: './options-notification.component.html',
  styleUrl: './options-notification.component.scss',
})
export class OptionsNotificationComponent extends OptionsBaseComponent {}
