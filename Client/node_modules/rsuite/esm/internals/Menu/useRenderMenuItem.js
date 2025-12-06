'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import Box from "../Box/index.js";
export function useRenderMenuItem(as) {
  return useCallback((props, overrideAs) => {
    if (as === 'li') {
      if (overrideAs) {
        return /*#__PURE__*/React.createElement("li", {
          role: "none presentation"
        }, /*#__PURE__*/React.createElement(Box, _extends({
          as: overrideAs
        }, props)));
      }
      return /*#__PURE__*/React.createElement(Box, _extends({
        as: as
      }, props));
    }
    return /*#__PURE__*/React.createElement("li", {
      role: "none presentation"
    }, /*#__PURE__*/React.createElement(Box, _extends({
      as: as
    }, props)));
  }, [as]);
}