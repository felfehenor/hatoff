import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { gamestate } from './gamestate';
import { getOption } from './options';

export const canSendNotifications = signal<boolean>(false);

type NotificationCategory =
  | 'ResourceGain'
  | 'LevelUp'
  | 'Recruitment'
  | 'Error'
  | 'Success';

const notification = new Subject<{
  message: string;
  type: 'show' | 'error' | 'success';
  category: NotificationCategory;
}>();
export const notification$ = notification.asObservable();

export function notify(message: string, category: NotificationCategory): void {
  if (!getOption(`notification${category}`)) return;
  if (!canSendNotifications()) return;
  notification.next({ message, type: 'show', category });
}

export function notifyError(message: string, mustSend = false): void {
  if (!canSendNotifications()) return;
  if (!mustSend && gamestate().meta.numTicks % 10 !== 0) return;
  notification.next({ message, type: 'error', category: 'Error' });
}

export function notifySuccess(message: string): void {
  if (!canSendNotifications()) return;
  notification.next({ message, type: 'success', category: 'Success' });
}
