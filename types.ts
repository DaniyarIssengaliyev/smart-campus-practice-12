export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  start: number; // minutes from 00:00
  end: number; // minutes from 00:00
  bookedBy: string;
}

export interface CheckResult {
  decision: 'available' | 'unavailable';
  reasons: string[];
}

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function labelToMinutes(label: string): number {
  if (
    !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(label) &&
    label !== '24:00'
  ) {
    return NaN;
  }

  const [h, m] = label.split(':').map(Number);
  return h * 60 + m;
}
