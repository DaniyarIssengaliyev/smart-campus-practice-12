const assert = require('node:assert/strict');
const {check, fixed} = require('./adapter');
const before = JSON.stringify(fixed);
const cases = [
  ['10:30', 60, false, 'FREE'],
  ['09:30', 30, false, 'OVERLAP'],
  ['10:30', 60, true, 'BLOCKED'],
  ['10:30', 0, false, 'INVALID'],
  ['10:30', 121, false, 'INVALID'],
  ['08:00', 30, false, 'INVALID'],
  ['10:00', 60, false, 'FREE']
];
cases.forEach(([start, duration, blocked, expected], i) => {
  const result = check(start, duration, blocked);
  assert.equal(result.code, expected);
  assert.equal(result.available, expected === 'FREE');
  assert.ok(result.message);
  console.log('T' + (i + 1), result.code, result.message);
});
assert.equal(JSON.stringify(fixed), before);
console.log('T8 UNCHANGED', fixed.length, 'bookings');
