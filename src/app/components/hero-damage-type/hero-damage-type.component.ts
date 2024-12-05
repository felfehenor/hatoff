import { Component, computed, input } from '@angular/core';
import { heroStatValue } from '../../helpers';
import { GameCombatant } from '../../interfaces';
import { DamageTypeComponent } from '../damage-type/damage-type.component';

@Component({
  selector: 'app-hero-damage-type',
  imports: [DamageTypeComponent],
  templateUrl: './hero-damage-type.component.html',
  styleUrl: './hero-damage-type.component.scss',
})
export class HeroDamageTypeComponent {
  public hero = input.required<GameCombatant>();
  public heroForce = computed(() => heroStatValue(this.hero(), 'force'));
}
