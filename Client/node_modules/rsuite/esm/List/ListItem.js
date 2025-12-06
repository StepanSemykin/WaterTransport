'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useEffect, useRef } from 'react';
import ListContext from "./ListContext.js";
import Box from "../internals/Box/index.js";
import { forwardRef, mergeRefs } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * The `List.Item` component is used to specify the layout of the list item.
 * @see https://rsuitejs.com/components/list
 */
const ListItem = forwardRef((props, ref) => {
  const {
    as,
    children,
    className,
    classPrefix = 'list-item',
    collection = 0,
    disabled,
    index,
    size: sizeProp,
    ...rest
  } = props;
  const {
    bordered,
    register,
    size: parentSize
  } = useContext(ListContext);
  const size = sizeProp || parentSize;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const listItemRef = useRef(null);
  useEffect(() => {
    if (listItemRef.current) {
      const {
        unregister
      } = register({
        node: listItemRef.current,
        edgeOffset: null,
        info: {
          collection,
          disabled,
          index
        }
      });
      return unregister;
    }
  }, [collection, disabled, index, register]);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "listitem",
    "aria-disabled": disabled,
    "data-size": size,
    "data-disabled": disabled,
    "data-bordered": bordered,
    ref: mergeRefs(listItemRef, ref),
    className: classes
  }, rest), children);
});
ListItem.displayName = 'ListItem';
export default ListItem;