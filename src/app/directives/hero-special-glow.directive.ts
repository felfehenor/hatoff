import { Directive, HostBinding, input } from '@angular/core';
import { GameHero } from '../interfaces';

@Directive({
  selector: '[appHeroSpecialGlow]',
  standalone: true,
})
export class HeroSpecialGlowDirective {
  public appHeroSpecialGlow = input.required<GameHero>();

  @HostBinding('class.special-hero-glow')
  public get isSpecial() {
    return this.appHeroSpecialGlow().isSpecial;
  }
}
