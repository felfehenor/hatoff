import { Directive, HostBinding, input } from '@angular/core';
import { isResearchComplete } from '../helpers';

@Directive({
  selector: '[appHideIfNotResearched]',
  standalone: true,
})
export class HideResearchDirective {
  public appHideIfNotResearched = input.required<string>();

  @HostBinding('class.hidden')
  public get isHidden() {
    return !isResearchComplete(this.appHideIfNotResearched())
      ? true
      : undefined;
  }
}
