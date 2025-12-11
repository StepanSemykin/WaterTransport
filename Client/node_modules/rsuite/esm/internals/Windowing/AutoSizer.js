'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState, useRef } from 'react';
import getStyle from 'dom-lib/getStyle';
import { useCallback } from 'react';
import { useElementResize, useMount } from "../hooks/index.js";
import { mergeRefs, mergeStyles } from "../utils/index.js";
/**
 * High-order component that automatically adjusts the width and height of a single child.
 *
 * @private
 */
const AutoSizer = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    children,
    className,
    disableHeight,
    disableWidth,
    defaultHeight,
    defaultWidth,
    style,
    onResize,
    ...rest
  } = props;
  const [height, setHeight] = useState(defaultHeight || 0);
  const [width, setWidth] = useState(defaultWidth || 0);
  const rootRef = useRef(null);
  const getParentNode = useCallback(() => {
    var _rootRef$current;
    if ((_rootRef$current = rootRef.current) !== null && _rootRef$current !== void 0 && _rootRef$current.parentNode && rootRef.current.parentNode.ownerDocument && rootRef.current.parentNode.ownerDocument.defaultView && rootRef.current.parentNode instanceof rootRef.current.parentNode.ownerDocument.defaultView.HTMLElement) {
      return rootRef.current.parentNode;
    }
    return null;
  }, []);
  const handleResize = useCallback(() => {
    const parentNode = getParentNode();
    if (parentNode) {
      const offsetHeight = parentNode.offsetHeight || 0;
      const offsetWidth = parentNode.offsetWidth || 0;
      const style = getStyle(parentNode);
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0;
      const paddingRight = parseInt(style.paddingRight, 10) || 0;
      const paddingTop = parseInt(style.paddingTop, 10) || 0;
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0;
      const newHeight = offsetHeight - paddingTop - paddingBottom;
      const newWidth = offsetWidth - paddingLeft - paddingRight;
      if (!disableHeight && height !== newHeight || !disableWidth && width !== newWidth) {
        setHeight(offsetHeight - paddingTop - paddingBottom);
        setWidth(offsetWidth - paddingLeft - paddingRight);
        onResize === null || onResize === void 0 || onResize({
          height: offsetHeight,
          width: offsetWidth
        });
      }
    }
  }, [disableHeight, disableWidth, getParentNode, height, onResize, width]);
  useMount(handleResize);
  useElementResize(getParentNode(), handleResize);
  const outerStyle = {
    overflow: 'visible'
  };
  const childParams = {
    width: 0,
    height: 0
  };
  if (!disableHeight) {
    outerStyle.height = 0;
    childParams.height = height;
  }
  if (!disableWidth) {
    outerStyle.width = 0;
    childParams.width = width;
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: className,
    ref: mergeRefs(rootRef, ref),
    style: mergeStyles(outerStyle, style)
  }, rest), children(childParams));
});
AutoSizer.displayName = 'AutoSizer';
export default AutoSizer;