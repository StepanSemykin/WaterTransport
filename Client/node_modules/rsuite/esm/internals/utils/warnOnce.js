'use client';
const warned = {};

/**
 * Logs a warning message
 * but dont warn a same message twice
 */
export function warnOnce(message) {
  if (!warned[message]) {
    console.warn(message);
    warned[message] = true;
  }
}
warnOnce._resetWarned = () => {
  for (const message in warned) {
    delete warned[message];
  }
};
export default warnOnce;