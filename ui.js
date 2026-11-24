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
