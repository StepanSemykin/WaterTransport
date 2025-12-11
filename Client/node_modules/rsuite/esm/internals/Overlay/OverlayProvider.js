'use client';
import React, { useContext } from 'react';
const OverlayContext = /*#__PURE__*/React.createContext({});
export const OverlayProvider = props => {
  const {
    overlayContainer,
    children
  } = props;
  return /*#__PURE__*/React.createElement(OverlayContext.Provider, {
    value: {
      overlayContainer
    }
  }, children);
};
export const useOverlay = () => useContext(OverlayContext);
OverlayProvider.displayName = 'OverlayProvider';