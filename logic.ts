import { Booking, CheckResult, Room } from './types';
import { minutesToLabel } from './types';

/**
 * Pure check for whether a candidate interval overlaps a given booking.
 * Touching endpoints are allowed: [a, b) and [b, c) do not overlap.
 */
function intervalsOverlap(
  candidateStart: number,
  candidateEnd: number,
  booking: Booking
): boolean {
  return candidateStart < booking.end && candidateEnd > booking.start;
}

/**
 * Check whether a candidate interval can be booked.
 *
 * AC1: 0 <= start < end <= 1440 and start after current time
 * AC2: duration <= 120 minutes
 * AC3: room must not be blocked
 * AC4: no overlap with existing bookings (touching endpoints allowed)
 * AC5: returns a decision only; never mutates bookings
 */
export function checkAvailability(
  room: Room | undefined,
  start: number,
  end: number,
  currentMinutes: number,
  existingBookings: Booking[]
): CheckResult {
  const reasons: string[] = [];

  if (!room) {
    return { decision: 'unavailable', reasons: ['Please select a room.'] };
  }
  if (
  !Number.isFinite(currentMinutes) ||
  currentMinutes < 0 ||
  currentMinutes > 1440
  ) {
    return {
      decision: 'unavailable',
      reasons: ['Please enter a valid current time.'],
    };
  }
  // AC1 — interval validity
  if (isNaN(start) || isNaN(end)) {
    return { decision: 'unavailable', reasons: ['Please enter a valid start and end time.'] };
  }
  if (start < 0 || end > 1440) {
    reasons.push('Times must be between 00:00 and 24:00.');
  }
  if (start >= end) {
    reasons.push('Start time must be earlier than end time.');
  }
  if (start <= currentMinutes) {
    reasons.push(`Start time must be after the current time (${minutesToLabel(currentMinutes)}).`);
  }

  // AC2 — max duration
  if (end - start > 120) {
    reasons.push('Bookings cannot be longer than 120 minutes.');
  }

  // AC3 — blocked room
  if (room.blocked) {
    reasons.push(`${room.name} is currently blocked and unavailable.`);
  }

  // AC4 — overlap (touching allowed)
  if (start < end && start >= 0 && end <= 1440) {
    const overlaps = existingBookings.filter(
      (b) => b.roomId === room.id && intervalsOverlap(start, end, b)
    );
    if (overlaps.length > 0) {
      reasons.push(
        'This interval overlaps an existing booking: ' +
          overlaps
            .map((b) => `${minutesToLabel(b.start)}–${minutesToLabel(b.end)} (${b.bookedBy})`)
            .join(', ') +
          '.'
      );
    }
  }

  return {
    decision: reasons.length === 0 ? 'available' : 'unavailable',
    reasons,
  };
}
