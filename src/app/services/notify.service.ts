import { inject, Injectable } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';
import { notification$ } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private toast = inject(HotToastService);

  async init() {
    notification$.subscribe((messageData) => {
      const { message, type } = messageData;

      this.toast[type](message);
    });
  }
}
