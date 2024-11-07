import { Directive, HostBinding, input } from '@angular/core';
import { isResearchComplete } from '../helpers';

@Directive({
  selector: '[appDisableIfNotResearched]',
  standalone: true,
})
export class DisableResearchDirective {
  public appDisableIfNotResearched = input.required<string>();

  @HostBinding('attr.disabled')
  public get isDisabled() {
    return !isResearchComplete(this.appDisableIfNotResearched())
      ? true
      : undefined;
  }
}
