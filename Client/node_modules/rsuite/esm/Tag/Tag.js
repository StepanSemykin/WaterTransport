'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import CloseButton from "../internals/CloseButton/index.js";
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeStyles, isPresetColor, createColorVariables } from "../internals/utils/index.js";
/**
 * The `Tag` component is used to label and categorize.
 * It can be used to mark the status of an object or classify it into different categories.
 *
 * @see https://rsuitejs.com/components/tag
 */
const Tag = forwardRef((props, ref) => {
  const {
    propsWithDefaults,
    getLocale
  } = useCustom('Tag', props);
  const {
    as,
    classPrefix = 'tag',
    size = 'md',
    color,
    children,
    closable,
    className,
    locale: overrideLocale,
    style,
    onClose,
    ...rest
  } = propsWithDefaults;
  const {
    remove
  } = getLocale('common', overrideLocale);
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const styles = useMemo(() => mergeStyles(style, createColorVariables(color, '--rs-tag-bg', '--rs-tag-text')), [style, color]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    style: styles
  }, rest, {
    "data-size": size,
    "data-color": isPresetColor(color) ? color : undefined
  }), /*#__PURE__*/React.createElement("span", {
    className: prefix`text`
  }, children), closable && /*#__PURE__*/React.createElement(CloseButton, {
    className: prefix`icon-close`,
    onClick: onClose,
    tabIndex: -1,
    locale: {
      closeLabel: remove
    }
  }));
});
Tag.displayName = 'Tag';
export default Tag;