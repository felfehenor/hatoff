import { Component, computed, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry } from '../../helpers';
import { GameBuff } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-hero-buff-display',
  imports: [ContentNameComponent, TippyDirective],
  templateUrl: './hero-buff-display.component.html',
  styleUrl: './hero-buff-display.component.scss',
})
export class HeroBuffDisplayComponent {
  public id = input.required<string>();
  public duration = input.required<number>();

  public buff = computed(() => getEntry<GameBuff>(this.id())!);
}
