'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useImperativeHandle, useCallback, useMemo } from 'react';
import ScrollView from "../ScrollView/index.js";
import { VariableSizeList } from 'react-window';
import { useCustom } from "../hooks/index.js";
import { forwardRef } from "../utils/index.js";
export const defaultItemSize = () => 36;
const OuterElementType = forwardRef(function OuterElementType(props, ref) {
  return /*#__PURE__*/React.createElement(ScrollView, _extends({
    scrollShadow: true,
    ref: ref
  }, props));
});

/**
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 *
 * @private
 */
const List = forwardRef((props, ref) => {
  const {
    rowHeight,
    as: Component = VariableSizeList,
    itemSize: itemSizeProp,
    scrollShadow,
    ...rest
  } = props;
  const listRef = useRef(null);
  const {
    rtl
  } = useCustom();
  useImperativeHandle(ref, () => ({
    resetAfterIndex: (index, shouldForceUpdate) => {
      var _listRef$current, _listRef$current$rese;
      (_listRef$current = listRef.current) === null || _listRef$current === void 0 || (_listRef$current$rese = _listRef$current.resetAfterIndex) === null || _listRef$current$rese === void 0 || _listRef$current$rese.call(_listRef$current, index, shouldForceUpdate);
    },
    scrollTo: scrollOffset => {
      var _listRef$current2, _listRef$current2$scr;
      (_listRef$current2 = listRef.current) === null || _listRef$current2 === void 0 || (_listRef$current2$scr = _listRef$current2.scrollTo) === null || _listRef$current2$scr === void 0 || _listRef$current2$scr.call(_listRef$current2, scrollOffset);
    },
    scrollToItem: (index, align) => {
      var _listRef$current3, _listRef$current3$scr;
      (_listRef$current3 = listRef.current) === null || _listRef$current3 === void 0 || (_listRef$current3$scr = _listRef$current3.scrollToItem) === null || _listRef$current3$scr === void 0 || _listRef$current3$scr.call(_listRef$current3, index, align);
    },
    scrollToRow: index => {
      var _listRef$current4, _listRef$current4$scr;
      (_listRef$current4 = listRef.current) === null || _listRef$current4 === void 0 || (_listRef$current4$scr = _listRef$current4.scrollToItem) === null || _listRef$current4$scr === void 0 || _listRef$current4$scr.call(_listRef$current4, index);
    }
  }));
  const setRowHeight = useCallback(index => {
    return typeof rowHeight === 'function' ? rowHeight({
      index
    }) : rowHeight || 0;
  }, [rowHeight]);
  const itemSize = useMemo(() => {
    if (typeof itemSizeProp === 'function') return itemSizeProp;
    return () => itemSizeProp;
  }, [itemSizeProp]);
  const compatibleProps = {
    itemSize,
    ...rest
  };
  if (rowHeight) {
    compatibleProps.itemSize = Component === VariableSizeList ? setRowHeight : rowHeight;
  }
  return /*#__PURE__*/React.createElement(Component, _extends({
    ref: listRef,
    direction: rtl ? 'rtl' : 'ltr'
  }, compatibleProps, {
    outerElementType: scrollShadow ? OuterElementType : undefined
  }));
});
List.displayName = 'List';
export default List;