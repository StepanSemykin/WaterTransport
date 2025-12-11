'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import MoreIcon from '@rsuite/icons/More';
import PagePreviousIcon from '@rsuite/icons/PagePrevious';
import PageTopIcon from '@rsuite/icons/PageTop';
import PageNextIcon from '@rsuite/icons/PageNext';
import PageEndIcon from '@rsuite/icons/PageEnd';
import PaginationButton from "./PaginationButton.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const icons = {
  more: /*#__PURE__*/React.createElement(MoreIcon, null),
  first: /*#__PURE__*/React.createElement(PageTopIcon, null),
  last: /*#__PURE__*/React.createElement(PageEndIcon, null),
  prev: /*#__PURE__*/React.createElement(PagePreviousIcon, null),
  next: /*#__PURE__*/React.createElement(PageNextIcon, null)
};
/**
 * Pagination component for displaying page numbers.
 *
 * @see https://rsuitejs.com/components/pagination
 */
const Pagination = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Pagination', props);
  const {
    as,
    className,
    classPrefix = 'pagination',
    disabled: disabledProp,
    locale,
    activePage = 1,
    maxButtons,
    pages = 1,
    ellipsis,
    boundaryLinks,
    first,
    prev,
    next,
    last,
    size = 'sm',
    linkAs,
    linkProps,
    onSelect,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const renderItem = (key, itemProps) => {
    const {
      eventKey,
      disabled,
      ...itemRest
    } = itemProps;
    let disabledButton = disabled;
    if (typeof disabledProp !== 'undefined') {
      disabledButton = typeof disabledProp === 'function' ? disabledProp(eventKey) : disabledProp;
    }
    const title = (locale === null || locale === void 0 ? void 0 : locale[key]) || eventKey;
    return /*#__PURE__*/React.createElement(PaginationButton, _extends({
      "aria-label": title,
      title: title
    }, itemRest, linkProps, {
      key: `${key}-${eventKey}`,
      eventKey: eventKey,
      as: linkAs,
      size: size,
      disabled: disabledButton,
      onSelect: disabledButton ? undefined : onSelect
    }));
  };
  const renderFirst = () => {
    if (!first) {
      return null;
    }
    return renderItem('first', {
      eventKey: 1,
      disabled: activePage === 1,
      children: /*#__PURE__*/React.createElement("span", {
        className: prefix`symbol`
      }, first === true ? icons.first : first)
    });
  };
  const renderPrev = () => {
    if (!prev) {
      return null;
    }
    return renderItem('prev', {
      eventKey: activePage - 1,
      disabled: activePage === 1,
      children: /*#__PURE__*/React.createElement("span", {
        className: prefix`symbol`
      }, prev === true ? icons.prev : prev)
    });
  };
  const renderPageButtons = () => {
    const pageButtons = [];
    let startPage;
    let endPage;
    let shouldShowEllipsisAfter;
    if (maxButtons) {
      const hiddenPagesBefore = activePage - Math.floor(maxButtons / 2);
      startPage = hiddenPagesBefore > 1 ? hiddenPagesBefore : 1;
      shouldShowEllipsisAfter = startPage + maxButtons <= pages;
      if (!shouldShowEllipsisAfter) {
        endPage = pages;
        startPage = pages - maxButtons + 1;
        if (startPage < 1) {
          startPage = 1;
        }
      } else {
        endPage = startPage + maxButtons - 1;
      }
    } else {
      startPage = 1;
      endPage = pages;
    }
    for (let pagenumber = startPage; pagenumber <= endPage; pagenumber += 1) {
      pageButtons.push(renderItem(pagenumber, {
        eventKey: pagenumber,
        active: pagenumber === activePage,
        children: pagenumber
      }));
    }
    if (boundaryLinks && ellipsis && startPage !== 1) {
      pageButtons.unshift(renderItem('more', {
        eventKey: 'ellipsisFirst',
        disabled: true,
        children: /*#__PURE__*/React.createElement("span", {
          className: prefix`symbol`
        }, ellipsis === true ? icons.more : ellipsis)
      }));
      pageButtons.unshift(renderItem(1, {
        eventKey: 1,
        children: 1
      }));
    }
    if (maxButtons && shouldShowEllipsisAfter && ellipsis) {
      pageButtons.push(renderItem('more', {
        eventKey: 'ellipsis',
        disabled: true,
        children: /*#__PURE__*/React.createElement("span", {
          className: prefix`symbol`
        }, ellipsis === true ? icons.more : ellipsis)
      }));
      if (boundaryLinks && endPage !== pages) {
        pageButtons.push(renderItem(pages, {
          eventKey: pages,
          disabled: false,
          children: pages
        }));
      }
    }
    return pageButtons;
  };
  const renderNext = () => {
    if (!next) {
      return null;
    }
    return renderItem('next', {
      eventKey: activePage + 1,
      disabled: activePage >= pages,
      children: /*#__PURE__*/React.createElement("span", {
        className: prefix`symbol`
      }, next === true ? icons.next : next)
    });
  };
  const renderLast = () => {
    if (!last) {
      return null;
    }
    return renderItem('last', {
      eventKey: pages,
      disabled: activePage >= pages,
      children: /*#__PURE__*/React.createElement("span", {
        className: prefix`symbol`
      }, last === true ? icons.last : last)
    });
  };
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    "data-size": size
  }, rest), renderFirst(), renderPrev(), renderPageButtons(), renderNext(), renderLast());
});
Pagination.displayName = 'Pagination';
export default Pagination;