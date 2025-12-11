'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useCallback, useEffect } from 'react';
import addStyle from 'dom-lib/addStyle';
import getWidth from 'dom-lib/getWidth';
import { useElementResize, useStyles, useEventCallback } from "../hooks/index.js";
import { forwardRef, mergeRefs } from "../utils/index.js";
import { getDOMNode } from "../utils/index.js";
import { useCombobox } from "./index.js";
// Define an array of placements that require resizing
const resizePlacement = ['topStart', 'topEnd', 'leftEnd', 'rightEnd', 'auto', 'autoVerticalStart', 'autoVerticalEnd', 'autoHorizontalEnd'];
const PickerPopup = forwardRef((props, ref) => {
  const {
    placement,
    breakpoint
  } = useCombobox();
  const {
    as: Component = 'div',
    autoWidth,
    className,
    classPrefix = 'picker-popup',
    target,
    ...rest
  } = props;
  const overlayRef = useRef(null);
  const handleResize = useEventCallback(() => {
    const instance = target === null || target === void 0 ? void 0 : target.current;
    if (instance && placement && resizePlacement.includes(placement)) {
      var _instance$updatePosit;
      (_instance$updatePosit = instance.updatePosition) === null || _instance$updatePosit === void 0 || _instance$updatePosit.call(instance);
    }
  });

  // Use useElementResize hook to listen for element size changes
  useElementResize(useCallback(() => overlayRef.current, []), handleResize);
  useEffect(() => {
    const toggle = target === null || target === void 0 ? void 0 : target.current;
    if (autoWidth && toggle !== null && toggle !== void 0 && toggle.root) {
      // Get the width of the button and set it to the menu to make them consistent
      const width = getWidth(getDOMNode(toggle.root));
      if (overlayRef.current) {
        addStyle(overlayRef.current, '--rs-picker-min-width', `${width}px`);
      }
    }
  }, [autoWidth, target, overlayRef]);
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Component, _extends({
    "data-testid": "picker-popup",
    ref: mergeRefs(overlayRef, ref),
    className: classes,
    "data-breakpoint": breakpoint
  }, rest));
});
PickerPopup.displayName = 'PickerPopup';
export default PickerPopup;