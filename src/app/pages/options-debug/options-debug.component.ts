import { Component } from '@angular/core';
import { getOption, setOption } from '../../helpers';
import { GameOptions } from '../../interfaces';

@Component({
  selector: 'app-options-debug',
  standalone: true,
  imports: [],
  templateUrl: './options-debug.component.html',
  styleUrl: './options-debug.component.scss',
})
export class OptionsDebugComponent {
  public currentValueForOption(option: keyof GameOptions) {
    return getOption(option);
  }

  public setValueForOption<T extends keyof GameOptions>(
    option: T,
    value: GameOptions[T],
  ) {
    setOption(option, value);
  }

  public setValueForOptionFromRange<T extends keyof GameOptions>(
    option: T,
    event: Event,
  ) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.setValueForOption(option, value as GameOptions[T]);
  }
}
