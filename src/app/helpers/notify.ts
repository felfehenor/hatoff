import { Subject } from 'rxjs';

const notification = new Subject<{ message: string }>();
export const notification$ = notification.asObservable();

export function notify(message: string): void {
  notification.next({ message });
}
