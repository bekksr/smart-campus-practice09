export const MINUTES_PER_DAY = 1440;

export function timeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time.trim());
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function minutesToTime(min: number): string {
  const clamped = Math.max(0, Math.min(MINUTES_PER_DAY, Math.round(min)));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatRange(start: number, end: number): string {
  return `${minutesToTime(start)} – ${minutesToTime(end)}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

export function nowAsTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
}

/**
 * Returns a sensible default request interval (start, end) in minutes,
 * rounded up to the next hour from `currentTime` with a 60-minute duration.
 * Clamped so the interval stays within 00:00–24:00.
 */
export function defaultRequestInterval(currentTime: number): {
  start: number;
  end: number;
} {
  const start = Math.min(Math.ceil(currentTime / 60) * 60, MINUTES_PER_DAY - 60);
  const end = start + 60;
  return { start, end };
}
