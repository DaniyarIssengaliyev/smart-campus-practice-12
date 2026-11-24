import { Room, Booking } from './types';

export const rooms: Room[] = [
  { id: 'r1', name: 'Room 101', building: 'Engineering Block', capacity: 40, blocked: false },
  { id: 'r2', name: 'Room 102', building: 'Engineering Block', capacity: 25, blocked: false },
  { id: 'r3', name: 'Room 201', building: 'Science Block', capacity: 60, blocked: true },
  { id: 'r4', name: 'Room 301', building: 'Library Wing', capacity: 15, blocked: false },
  { id: 'r5', name: 'Room 405', building: 'Library Wing', capacity: 30, blocked: false },
];

export const bookings: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'CS Dept' },
  { id: 'b2', roomId: 'r1', start: 720, end: 780, bookedBy: 'Math Dept' },
  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Physics Lab' },
  { id: 'b4', roomId: 'r4', start: 480, end: 540, bookedBy: 'Study Group' },
  { id: 'b5', roomId: 'r5', start: 900, end: 960, bookedBy: 'Seminar' },
];

// Default "current time" for the demo — 08:30
export const defaultCurrentMinutes = 510;
