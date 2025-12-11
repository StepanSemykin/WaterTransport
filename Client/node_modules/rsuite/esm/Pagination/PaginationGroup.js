'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import classNames from 'classnames';
import Pagination from "./Pagination.js";
import Divider from "../Divider/index.js";
import Input from "../Input/index.js";
import LimitPicker from "./LimitPicker.js";
import Box from "../internals/Box/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, tplTransform } from "../internals/utils/index.js";

/**
 * The layout of the paging component.
 */

const defaultLayout = ['pager'];
const defaultLimitOptions = [30, 50, 100];

/**
 * Pagination component for displaying page numbers.
 *
 * @see https://rsuitejs.com/components/pagination
 */
const PaginationGroup = forwardRef((props, ref) => {
  const {
    as,
    activePage: activePageProp,
    classPrefix = 'pagination-group',
    className,
    disabled,
    size,
    style,
    total,
    prev,
    next,
    first,
    last,
    limitOptions = defaultLimitOptions,
    limit: limitProp,
    locale: localeProp,
    layout = defaultLayout,
    maxButtons,
    onChangePage,
    onChangeLimit,
    ...rest
  } = props;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const [limit, setLimit] = useControlled(limitProp, 30);
  const [activePage, setActivePage] = useControlled(activePageProp, 1);
  const pages = Math.floor(total / limit) + (total % limit ? 1 : 0);
  const classes = merge(className, withPrefix());
  const {
    getLocale
  } = useCustom();
  const locale = getLocale('Pagination', localeProp);
  const handleInputBlur = useEventCallback(event => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= pages) {
      onChangePage === null || onChangePage === void 0 || onChangePage(value);
      setActivePage(value);
    }
    event.target.value = '';
  });
  const handleInputPressEnter = useEventCallback(event => {
    var _event$target;
    (_event$target = event.target) === null || _event$target === void 0 || _event$target.blur();
  });
  const handleChangeLimit = useEventCallback(value => {
    setLimit(value);
    onChangeLimit === null || onChangeLimit === void 0 || onChangeLimit(value);
  });
  return /*#__PURE__*/React.createElement(Box, {
    as: as,
    ref: ref,
    className: classes,
    "data-size": size,
    style: style
  }, layout.map((key, index) => {
    const onlyKey = `${key}${index}`;
    switch (key) {
      case '-':
        return /*#__PURE__*/React.createElement("div", {
          className: prefix('grow'),
          key: onlyKey
        });
      case '|':
        return /*#__PURE__*/React.createElement(Divider, {
          vertical: true,
          key: onlyKey
        });
      case 'pager':
        return /*#__PURE__*/React.createElement(Pagination, _extends({
          key: onlyKey,
          size: size,
          prev: prev,
          next: next,
          first: first,
          last: last,
          maxButtons: maxButtons,
          pages: pages,
          disabled: disabled,
          onSelect: onChangePage // fixme don't use any
          ,
          activePage: activePage
        }, rest));
      case 'total':
        return /*#__PURE__*/React.createElement("div", {
          key: onlyKey,
          className: prefix('total')
        }, locale.total && tplTransform(locale.total, total));
      case 'skip':
        return /*#__PURE__*/React.createElement("div", {
          key: onlyKey,
          className: classNames(prefix('skip'))
        }, locale.skip && tplTransform(locale.skip, /*#__PURE__*/React.createElement(Input, {
          size: size,
          disabled: typeof disabled === 'function' ? disabled('skip') : Boolean(disabled),
          onBlur: handleInputBlur,
          onPressEnter: handleInputPressEnter
        })));
      case 'limit':
        return /*#__PURE__*/React.createElement(LimitPicker, {
          key: onlyKey,
          size: size,
          locale: locale,
          limit: limit,
          onChangeLimit: handleChangeLimit,
          limitOptions: limitOptions,
          disabled: disabled,
          prefix: prefix
        });
      default:
        return key;
    }
  }));
});
PaginationGroup.displayName = 'PaginationGroup';
export default PaginationGroup;