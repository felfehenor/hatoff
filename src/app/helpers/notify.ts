import { Subject } from 'rxjs';

const notification = new Subject<{
  message: string;
  type: 'show' | 'error' | 'success';
}>();
export const notification$ = notification.asObservable();

export function notify(message: string): void {
  notification.next({ message, type: 'show' });
}

export function notifyError(message: string): void {
  notification.next({ message, type: 'error' });
}

export function notifySuccess(message: string): void {
  notification.next({ message, type: 'success' });
}
