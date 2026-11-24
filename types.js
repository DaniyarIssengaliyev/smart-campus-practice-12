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
