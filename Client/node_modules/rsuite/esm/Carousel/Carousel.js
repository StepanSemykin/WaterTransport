'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState, useMemo, useCallback, useRef } from 'react';
import classNames from 'classnames';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom, useControlled, useUpdateEffect, useTimeout } from "../internals/hooks/index.js";
import { forwardRef, guid, rch, mergeRefs } from "../internals/utils/index.js";
/**
 * The Carousel component is used to display a series of content.
 * @see https://rsuitejs.com/components/carousel
 */
const Carousel = forwardRef((props, ref) => {
  const {
    rtl,
    propsWithDefaults
  } = useCustom('Carousel', props);
  const {
    as,
    children,
    classPrefix = 'carousel',
    className,
    placement = 'bottom',
    shape = 'dot',
    autoplay,
    autoplayInterval = 4000,
    activeIndex: activeIndexProp,
    defaultActiveIndex = 0,
    onSelect,
    onSlideStart,
    onSlideEnd,
    ...rest
  } = propsWithDefaults;
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const count = rch.count(children);
  const labels = [];
  const vertical = placement === 'left' || placement === 'right';
  const lengthKey = vertical ? 'height' : 'width';
  const [activeIndex, setActiveIndex, isControlled] = useControlled(activeIndexProp, defaultActiveIndex);
  const [lastIndex, setLastIndex] = useState(0);
  const rootRef = useRef(null);
  useUpdateEffect(() => {
    // When the index is controlled, the index is not updated when the number of children changes.
    if (isControlled) {
      return;
    }
    // Reset the index when the number of children changes.
    setActiveIndex(0);
  }, [children, isControlled]);

  // Set a timer for automatic playback.
  // `autoplay` needs to be cast to boolean type to avoid undefined parameters.
  const {
    clear,
    reset
  } = useTimeout(() => handleSlide(), autoplayInterval, !!autoplay && count > 1);
  const handleSlide = useCallback((nextActiveIndex, event) => {
    if (!rootRef.current) {
      return;
    }
    clear();
    const index = nextActiveIndex !== null && nextActiveIndex !== void 0 ? nextActiveIndex : activeIndex + 1;

    // When index is greater than count, start from 1 again.
    const nextIndex = index % count;
    setActiveIndex(nextIndex);
    onSlideStart === null || onSlideStart === void 0 || onSlideStart(nextIndex, event);
    setLastIndex(nextActiveIndex == null ? activeIndex : nextIndex);
    reset();
  }, [activeIndex, count, setActiveIndex, clear, onSlideStart, reset]);
  const handleChange = event => {
    const activeIndex = +event.target.value;
    handleSlide(activeIndex, event);
    onSelect === null || onSelect === void 0 || onSelect(activeIndex, event);
  };
  const handleTransitionEnd = useCallback(event => {
    onSlideEnd === null || onSlideEnd === void 0 || onSlideEnd(activeIndex, event);
  }, [activeIndex, onSlideEnd]);
  const uniqueId = useMemo(() => guid(), []);
  const items = rch.map(children, (child, index) => {
    var _child$props;
    if (!child) {
      return;
    }
    const inputKey = `indicator_${uniqueId}_${index}`;
    labels.push(/*#__PURE__*/React.createElement("li", {
      key: `label${index}`,
      className: prefix('label-wrapper')
    }, /*#__PURE__*/React.createElement("input", {
      name: inputKey,
      id: inputKey,
      type: "radio",
      onChange: handleChange,
      value: index,
      checked: activeIndex === index
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: inputKey,
      className: prefix('label')
    })));
    return /*#__PURE__*/React.cloneElement(child, {
      key: `slider-item${index}`,
      'aria-hidden': activeIndex !== index,
      style: {
        ...child.props.style,
        [lengthKey]: `${100 / count}%`
      },
      className: classNames(prefix('slider-item'), (_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.className)
    });
  });
  const classes = merge(className, withPrefix(`placement-${placement}`, `shape-${shape}`));
  const positiveOrder = vertical || !rtl;
  const sign = positiveOrder ? '-' : '';
  const activeRatio = `${sign}${100 / count * activeIndex}%`;
  const sliderStyles = {
    [lengthKey]: `${count * 100}%`,
    transform: vertical ? `translate3d(0, ${activeRatio} ,0)` : `translate3d(${activeRatio}, 0 ,0)`
  };
  const showMask = count > 1 && activeIndex === 0 && activeIndex !== lastIndex;
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: mergeRefs(ref, rootRef),
    className: classes
  }), /*#__PURE__*/React.createElement("div", {
    className: prefix('content')
  }, /*#__PURE__*/React.createElement("div", {
    "data-testid": "carousel-slider",
    className: prefix('slider'),
    style: sliderStyles,
    onTransitionEnd: handleTransitionEnd
  }, items), showMask && /*#__PURE__*/React.createElement("div", {
    className: prefix('slider-after', {
      'slider-after-vertical': vertical
    }),
    style: {
      [lengthKey]: '200%'
    }
  }, [items[items.length - 1], items[0]].map(node => /*#__PURE__*/React.cloneElement(node, {
    key: node.key,
    style: {
      ...node.props.style,
      [lengthKey]: '50%'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: prefix('toolbar')
  }, /*#__PURE__*/React.createElement("ul", null, labels)));
});
Carousel.displayName = 'Carousel';
export default Carousel;