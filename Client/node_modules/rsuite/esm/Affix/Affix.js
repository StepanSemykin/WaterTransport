'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import getOffset from 'dom-lib/getOffset';
import Box from "../internals/Box/index.js";
import { useStyles, useElementResize, useEventListener, useCustom, useMount } from "../internals/hooks/index.js";
import { mergeRefs, forwardRef } from "../internals/utils/index.js";
/**
 * Get the layout size and offset of the mount element
 */
function useOffset(mountRef, onOffsetChange) {
  const [offset, setOffset] = useState(null);
  const updateOffset = useCallback(() => {
    if (!mountRef.current) {
      return;
    }
    const newOffset = getOffset(mountRef.current);
    if ((newOffset === null || newOffset === void 0 ? void 0 : newOffset.height) !== (offset === null || offset === void 0 ? void 0 : offset.height) || (newOffset === null || newOffset === void 0 ? void 0 : newOffset.width) !== (offset === null || offset === void 0 ? void 0 : offset.width) || (newOffset === null || newOffset === void 0 ? void 0 : newOffset.top) !== (offset === null || offset === void 0 ? void 0 : offset.top) || (newOffset === null || newOffset === void 0 ? void 0 : newOffset.left) !== (offset === null || offset === void 0 ? void 0 : offset.left)) {
      setOffset(newOffset);
      if (offset !== null && newOffset !== null) {
        onOffsetChange === null || onOffsetChange === void 0 || onOffsetChange(newOffset);
      }
    }
  }, [mountRef, offset, onOffsetChange]);

  // Update after the element size changes
  useElementResize(() => mountRef.current, updateOffset);

  // Initialize after the first render
  useMount(updateOffset);

  // Update after window size changes
  useEventListener(window, 'resize', updateOffset, false);

  // Update after window scroll
  useEventListener(window, 'scroll', debounce(updateOffset, 100), false);
  return offset;
}

/**
 * Get the layout size and offset of the container element
 * @param container
 */
function useContainerOffset(container) {
  const [offset, setOffset] = useState(null);
  useEffect(() => {
    const node = typeof container === 'function' ? container() : container;
    setOffset(node ? getOffset(node) : null);
  }, [container]);
  return offset;
}

/**
 * Check whether the current element should be in a fixed state.
 * @param offset
 * @param containerOffset
 * @param props
 */
function useFixed(offset, containerOffset, props) {
  const {
    top,
    onChange
  } = props;
  const [fixed, setFixed] = useState(false);
  const handleScroll = useCallback(() => {
    if (!offset) {
      return;
    }
    const scrollY = window.scrollY || window.pageYOffset;

    // When the scroll distance exceeds the element's top value, it is fixed.
    let nextFixed = scrollY - (Number(offset === null || offset === void 0 ? void 0 : offset.top) - Number(top)) >= 0;

    // If the current element is specified in the container,
    // add to determine whether the current container is in the window range.
    if (containerOffset) {
      nextFixed = nextFixed && scrollY < Number(containerOffset.top) + Number(containerOffset.height);
    }
    if (nextFixed !== fixed) {
      setFixed(nextFixed);
      onChange === null || onChange === void 0 || onChange(nextFixed);
    }
  }, [offset, top, containerOffset, fixed, onChange]);

  // Add scroll event to window
  useEventListener(window, 'scroll', handleScroll, false);
  return fixed;
}

/**
 * Components such as navigation, buttons, etc. can be fixed in the visible range.
 * Commonly used for pages with long content, fixed the specified elements in the visible range of the page to assist in quick operation.
 *
 * @see https://rsuitejs.com/components/affix/
 */
const Affix = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Affix', props);
  const {
    as,
    classPrefix = 'affix',
    className,
    children,
    container,
    top = 0,
    onChange,
    onOffsetChange,
    ...rest
  } = propsWithDefaults;
  const mountRef = useRef(null);
  const offset = useOffset(mountRef, onOffsetChange);
  const containerOffset = useContainerOffset(container);
  const fixed = useFixed(offset, containerOffset, {
    top,
    onChange
  });
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, {
    [withPrefix()]: fixed
  });
  const {
    width,
    height
  } = offset || {};
  const placeholderStyles = fixed ? {
    width,
    height
  } : undefined;
  const fixedStyles = {
    position: 'fixed',
    top,
    width,
    zIndex: 10
  };
  const affixStyles = fixed ? fixedStyles : undefined;
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: mergeRefs(mountRef, ref)
  }), /*#__PURE__*/React.createElement("div", {
    className: classes,
    style: affixStyles
  }, children), fixed && /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: placeholderStyles
  }));
});
Affix.displayName = 'Affix';
export default Affix;