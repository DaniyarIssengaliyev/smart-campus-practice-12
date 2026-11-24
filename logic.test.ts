import { describe, it, expect, beforeEach } from 'vitest';
import { checkAvailability } from './logic';
import { rooms, bookings, defaultCurrentMinutes } from './data';
import { Booking, Room } from './types';

function findRoom(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}

const ROOM_R1 = findRoom('r1')!;
const ROOM_R2 = findRoom('r2')!;
const ROOM_R3 = findRoom('r3')!; // blocked
const ROOM_R4 = findRoom('r4')!;

// Deep copy of bookings so tests cannot mutate the fixture.
function cloneBookings(): Booking[] {
  return bookings.map((b) => ({ ...b }));
}

let snapshot: Booking[];

beforeEach(() => {
  snapshot = bookings.map((b) => ({ ...b }));
});

describe('AC1 — invalid and past times', () => {
  it('rejects start >= end', () => {
    const res = checkAvailability(ROOM_R1, 600, 600, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toContain('Start time must be earlier than end time.');
  });

  it('rejects start > end', () => {
    const res = checkAvailability(ROOM_R1, 700, 600, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toContain('Start time must be earlier than end time.');
  });

  it('rejects start at or before current time', () => {
    const res = checkAvailability(ROOM_R1, defaultCurrentMinutes, 660, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons.some((r) => r.startsWith('Start time must be after the current time'))).toBe(true);
  });

  it('rejects start before current time', () => {
    const res = checkAvailability(ROOM_R1, 400, 460, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons.some((r) => r.startsWith('Start time must be after the current time'))).toBe(true);
  });

  it('rejects times outside 0–1440', () => {
    const res = checkAvailability(ROOM_R1, -10, 60, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toContain('Times must be between 00:00 and 24:00.');
  });

  it('rejects end > 1440', () => {
    const res = checkAvailability(ROOM_R1, 1400, 1500, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toContain('Times must be between 00:00 and 24:00.');
  });

  it('accepts a valid future interval within range', () => {
    // Room r2 has booking 600–660; 800–860 is free and after current time
    const res = checkAvailability(ROOM_R2, 800, 860, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('available');
    expect(res.reasons).toEqual([]);
  });
});

describe('AC2 — duration limit', () => {
  it('accepts exactly 120 minutes', () => {
    const res = checkAvailability(ROOM_R4, 800, 920, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('available');
    expect(res.reasons).toEqual([]);
  });

  it('rejects 121 minutes', () => {
    const res = checkAvailability(ROOM_R4, 800, 921, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toContain('Bookings cannot be longer than 120 minutes.');
  });
});

describe('AC3 — blocked rooms', () => {
  it('rejects a blocked room even with a valid interval', () => {
    const res = checkAvailability(ROOM_R3, 800, 860, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toContain('Room 201 is currently blocked and unavailable.');
  });
});

describe('AC4 — overlapping bookings (touching allowed)', () => {
  it('rejects an interval fully inside an existing booking', () => {
    // r1 has 540–600; 550–580 is inside it
    const res = checkAvailability(ROOM_R1, 550, 580, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons.some((r) => r.startsWith('This interval overlaps an existing booking'))).toBe(true);
  });

  it('rejects an interval partially overlapping an existing booking', () => {
    // r1 has 540–600; 580–640 overlaps the tail
    const res = checkAvailability(ROOM_R1, 580, 640, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons.some((r) => r.startsWith('This interval overlaps an existing booking'))).toBe(true);
  });

  it('allows a candidate that ends exactly when an existing booking starts (touching start)', () => {
    // r1 has 540–600; 480–540 touches at the start boundary
    // currentMinutes is 510, so start 480 is before current time — use a room/time that avoids AC1
    // r4 has booking 480–540. Use r4 with 420–480? 420 < 510 (current). Need start > 510.
    // r1 has 720–780 (Math Dept). Candidate 660–720 touches at start, start 660 > 510.
    const res = checkAvailability(ROOM_R1, 660, 720, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('available');
    expect(res.reasons).toEqual([]);
  });

  it('allows a candidate that starts exactly when an existing booking ends (touching end)', () => {
    // r1 has 540–600. Candidate 600–660 touches at end boundary, start 600 > 510.
    const res = checkAvailability(ROOM_R1, 600, 660, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('available');
    expect(res.reasons).toEqual([]);
  });

  it('rejects a candidate that overlaps two existing bookings', () => {
    // r1 has 540–600 and 720–780. Candidate 590–730 overlaps both.
    const res = checkAvailability(ROOM_R1, 590, 730, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons.some((r) => r.startsWith('This interval overlaps an existing booking'))).toBe(true);
  });
});

describe('AC5 — does not mutate booking data', () => {
  it('leaves the bookings array and its elements unchanged after a check', () => {
    const clones = cloneBookings();
    checkAvailability(ROOM_R1, 550, 580, defaultCurrentMinutes, clones);
    checkAvailability(ROOM_R3, 800, 860, defaultCurrentMinutes, clones);
    expect(clones).toEqual(snapshot);
  });

  it('leaves the original fixture unchanged after a check', () => {
    const before = bookings.map((b) => ({ ...b }));
    checkAvailability(ROOM_R1, 550, 580, defaultCurrentMinutes, bookings);
    expect(bookings).toEqual(before);
  });

  it('returns available for a valid request without side effects', () => {
    const res = checkAvailability(ROOM_R4, 800, 860, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('available');
    expect(res.reasons).toEqual([]);
  });

  it('returns unavailable with reasons for an invalid request', () => {
    const res = checkAvailability(ROOM_R1, 550, 580, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons.length).toBeGreaterThan(0);
  });
});

describe('Edge cases', () => {
  it('rejects when no room is selected', () => {
    const res = checkAvailability(undefined, 800, 860, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toEqual(['Please select a room.']);
  });

  it('rejects NaN start/end', () => {
    const res = checkAvailability(ROOM_R1, NaN, NaN, defaultCurrentMinutes, cloneBookings());
    expect(res.decision).toBe('unavailable');
    expect(res.reasons).toEqual(['Please enter a valid start and end time.']);
  });
});
