'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import useSortHelper from "./helper/useSortHelper.js";
import ListContext from "./ListContext.js";
import ListItem from "./ListItem.js";
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs } from "../internals/utils/index.js";
const Subcomponents = {
  Item: ListItem
};

/**
 * The `List` component is used to specify the layout of the list.
 * @see https://rsuitejs.com/components/list
 */
const List = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('List', props);
  const {
    as,
    autoScroll = true,
    bordered,
    classPrefix = 'list',
    className,
    children,
    divider = true,
    hover,
    size = 'md',
    sortable,
    pressDelay = 0,
    transitionDuration = 300,
    onSort,
    onSortEnd,
    onSortMove,
    onSortStart,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const {
    containerRef,
    register,
    sorting,
    handleEnd,
    handleStart,
    handleTouchStart,
    handleTouchEnd
  } = useSortHelper({
    autoScroll,
    onSort,
    onSortEnd,
    onSortMove,
    onSortStart,
    pressDelay,
    transitionDuration
  });
  const classes = merge(className, withPrefix());
  const contextValue = useMemo(() => ({
    bordered,
    size,
    register
  }), [bordered, register, size]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "list",
    ref: mergeRefs(containerRef, ref),
    className: classes,
    onMouseDown: sortable ? handleStart : undefined,
    onMouseUp: sortable ? handleEnd : undefined,
    onTouchStart: sortable ? handleTouchStart : undefined,
    onTouchEnd: sortable ? handleTouchEnd : undefined,
    "data-bordered": bordered,
    "data-hover": hover,
    "data-sortable": sortable,
    "data-sorting": sorting,
    "data-divider": divider
  }, rest), /*#__PURE__*/React.createElement(ListContext.Provider, {
    value: contextValue
  }, children));
}, Subcomponents);
List.displayName = 'List';
export default List;