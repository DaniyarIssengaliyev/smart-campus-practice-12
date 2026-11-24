const {checkAvailability} = require('./logic');
const {rooms, bookings, defaultCurrentMinutes} = require('./data');
const {labelToMinutes} = require('./types');

const room = rooms[0];
const fixed = bookings.filter(booking => booking.roomId === room.id);

function check(time, duration, blocked = false) {
  const start = typeof time === 'string' ? labelToMinutes(time) : NaN;
  const invalid = message => ({available: false, code: 'INVALID', message});
  if (!Number.isInteger(start) || start >= 1440) return invalid('Enter a valid start time in HH:MM format.');
  if (!Number.isInteger(duration) || duration < 1 || duration > 120) return invalid('Duration must be 1 to 120 minutes.');
  if (start <= defaultCurrentMinutes) return invalid('Start must be after 08:30.');
  if (start + duration > 1440) return invalid('Interval must end by midnight.');

  const result = checkAvailability({...room, blocked}, start, start + duration, defaultCurrentMinutes, fixed);
  if (result.decision === 'available') return {available: true, code: 'FREE', message: 'Room 101 is available.'};
  return {available: false, code: blocked ? 'BLOCKED' : 'OVERLAP', message: result.reasons.join(' ')};
}

module.exports = {check, fixed};
