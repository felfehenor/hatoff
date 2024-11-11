import { Subject } from 'rxjs';
import { getOption } from './options';

type NotificationCategory = 'ResourceGain' | 'LevelUp' | 'Error' | 'Success';

const notification = new Subject<{
  message: string;
  type: 'show' | 'error' | 'success';
  category: NotificationCategory;
}>();
export const notification$ = notification.asObservable();

export function notify(message: string, category: NotificationCategory): void {
  if (!getOption(`notification${category}`)) return;
  notification.next({ message, type: 'show', category });
}

export function notifyError(message: string): void {
  notification.next({ message, type: 'error', category: 'Error' });
}

export function notifySuccess(message: string): void {
  notification.next({ message, type: 'success', category: 'Success' });
}
