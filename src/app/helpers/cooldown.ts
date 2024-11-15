export function cooldown(seconds: number): number {
  return Date.now() + seconds * 1000;
}
