'use client';
import { createRoot } from 'react-dom/client';
import { guid } from "../internals/utils/index.js";
import { RSUITE_TOASTER_ID } from "../internals/symbols.js";
export function render(element, container) {
  const mountElement = document.createElement('div');
  mountElement.className = 'rs-toaster-mount-element';
  const containerElement = container;

  // Add the detached element to the root
  containerElement.appendChild(mountElement);
  if (!containerElement[RSUITE_TOASTER_ID]) {
    // Attach the containerId to the containerElement
    containerElement[RSUITE_TOASTER_ID] = guid();
  }
  const root = createRoot(mountElement, {
    identifierPrefix: 'rs-root-'
  });
  root.render(element);
  return containerElement[RSUITE_TOASTER_ID];
}