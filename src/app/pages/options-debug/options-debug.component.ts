import { Component } from '@angular/core';
import { OptionsBaseComponent } from '../options/option-base-page.component';

@Component({
  selector: 'app-options-debug',
  standalone: true,
  imports: [],
  templateUrl: './options-debug.component.html',
  styleUrl: './options-debug.component.scss',
})
export class OptionsDebugComponent extends OptionsBaseComponent {}
