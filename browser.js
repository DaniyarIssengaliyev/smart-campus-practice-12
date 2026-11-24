(() => {
const modules = {
"./types": function(require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.minutesToLabel = minutesToLabel;
exports.labelToMinutes = labelToMinutes;
function minutesToLabel(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function labelToMinutes(label) {
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(label) &&
        label !== '24:00') {
        return NaN;
    }
    const [h, m] = label.split(':').map(Number);
    return h * 60 + m;
}

},
"./data": function(require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCurrentMinutes = exports.bookings = exports.rooms = void 0;
exports.rooms = [
    { id: 'r1', name: 'Room 101', building: 'Engineering Block', capacity: 40, blocked: false },
    { id: 'r2', name: 'Room 102', building: 'Engineering Block', capacity: 25, blocked: false },
    { id: 'r3', name: 'Room 201', building: 'Science Block', capacity: 60, blocked: true },
    { id: 'r4', name: 'Room 301', building: 'Library Wing', capacity: 15, blocked: false },
    { id: 'r5', name: 'Room 405', building: 'Library Wing', capacity: 30, blocked: false },
];
exports.bookings = [
    { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'CS Dept' },
    { id: 'b2', roomId: 'r1', start: 720, end: 780, bookedBy: 'Math Dept' },
    { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Physics Lab' },
    { id: 'b4', roomId: 'r4', start: 480, end: 540, bookedBy: 'Study Group' },
    { id: 'b5', roomId: 'r5', start: 900, end: 960, bookedBy: 'Seminar' },
];
// Default "current time" for the demo — 08:30
exports.defaultCurrentMinutes = 510;

},
"./logic": function(require, module, exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailability = checkAvailability;
const types_1 = require("./types");
/**
 * Pure check for whether a candidate interval overlaps a given booking.
 * Touching endpoints are allowed: [a, b) and [b, c) do not overlap.
 */
function intervalsOverlap(candidateStart, candidateEnd, booking) {
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
function checkAvailability(room, start, end, currentMinutes, existingBookings) {
    const reasons = [];
    if (!room) {
        return { decision: 'unavailable', reasons: ['Please select a room.'] };
    }
    if (!Number.isFinite(currentMinutes) ||
        currentMinutes < 0 ||
        currentMinutes > 1440) {
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
        reasons.push(`Start time must be after the current time (${(0, types_1.minutesToLabel)(currentMinutes)}).`);
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
        const overlaps = existingBookings.filter((b) => b.roomId === room.id && intervalsOverlap(start, end, b));
        if (overlaps.length > 0) {
            reasons.push('This interval overlaps an existing booking: ' +
                overlaps
                    .map((b) => `${(0, types_1.minutesToLabel)(b.start)}–${(0, types_1.minutesToLabel)(b.end)} (${b.bookedBy})`)
                    .join(', ') +
                '.');
        }
    }
    return {
        decision: reasons.length === 0 ? 'available' : 'unavailable',
        reasons,
    };
}

},
"./adapter": function(require, module, exports) {
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

},
"./ui": function(require, module, exports) {
const {check, fixed} = require('./adapter');
const {minutesToLabel} = require('./types');
const byId = id => document.getElementById(id);

for (const booking of fixed) {
  const slot = document.createElement('div');
  slot.className = 'slot';
  const time = document.createElement('strong');
  time.textContent = minutesToLabel(booking.start) + ' – ' + minutesToLabel(booking.end);
  const owner = document.createElement('p');
  owner.textContent = booking.bookedBy;
  slot.append(time, owner);
  byId('bookings').append(slot);
}

byId('form').addEventListener('submit', event => {
  event.preventDefault();
  const result = check(byId('start').value.trim(), byId('duration').valueAsNumber, byId('status').value === 'true');
  const panel = byId('result');
  panel.className = 'result ' + (result.available ? 'good' : 'bad');
  const title = document.createElement('strong');
  title.textContent = result.available ? 'Available' : result.code === 'INVALID' ? 'Validation error' : 'Unavailable';
  const reason = document.createElement('p');
  reason.textContent = result.message;
  panel.replaceChildren(title, reason);
  panel.dataset.code = result.code;
});

}
};

const cache = {};
function load(name) {
  if (cache[name]) return cache[name].exports;
  const module = {exports: {}};
  cache[name] = module;
  modules[name](load, module, module.exports);
  return module.exports;
}
load('./ui');
})();
