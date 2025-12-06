'use client';
import getPosition from 'dom-lib/getPosition';
import scrollTop from 'dom-lib/scrollTop';
export function scrollToTime(time, row) {
  if (!row) return;
  const scrollToPosition = (container, value, type) => {
    const node = container.querySelector(`[data-key="${type}-${value}"]`);
    if (node) {
      const position = getPosition(node, container);
      if (position) {
        scrollTop(container, position.top);
      }
    }
  };
  Object.entries(time).forEach(([type, value]) => {
    const container = row.querySelector(`[data-type="${type}"]`);
    if (container) {
      scrollToPosition(container, value, type);
    }
  });
}