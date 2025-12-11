'use client';
import React from 'react';
export let DisclosureActionTypes = /*#__PURE__*/function (DisclosureActionTypes) {
  DisclosureActionTypes[DisclosureActionTypes["Show"] = 0] = "Show";
  DisclosureActionTypes[DisclosureActionTypes["Hide"] = 1] = "Hide";
  return DisclosureActionTypes;
}({});
const DisclosureContext = /*#__PURE__*/React.createContext(null);
DisclosureContext.displayName = 'Disclosure.Context';
export default DisclosureContext;