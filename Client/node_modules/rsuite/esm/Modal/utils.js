'use client';
import getHeight from 'dom-lib/getHeight';
import on from 'dom-lib/on';
import { useState, useRef, useCallback, useEffect } from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
export const useBodyStyles = (ref, options) => {
  const [bodyStyles, setBodyStyles] = useState({});
  const {
    overflow,
    prefix,
    size
  } = options;
  const windowResizeListener = useRef(null);
  const contentElement = useRef(null);
  const contentElementResizeObserver = useRef(null);
  const updateBodyStyles = useCallback((_event, entering) => {
    const dialog = ref.current;
    const styles = {
      overflow: 'auto'
    };
    if (dialog) {
      // default margin
      let headerHeight = 46;
      let footerHeight = 46;
      const headerDOM = dialog.querySelector(`.${prefix('header')}`);
      const footerDOM = dialog.querySelector(`.${prefix('footer')}`);
      headerHeight = headerDOM ? getHeight(headerDOM) + headerHeight : headerHeight;
      footerHeight = footerDOM ? getHeight(footerDOM) + footerHeight : footerHeight;

      // Get the actual margin from the modal element itself (.rs-modal)
      const computedStyle = window.getComputedStyle(dialog);
      const marginTop = parseFloat(computedStyle.marginTop) || 0;
      const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
      const dialogMargin = marginTop + marginBottom;

      // Get padding from the wrapper if needed
      const wrapper = dialog.parentElement;
      let wrapperPadding = 0;
      if (wrapper) {
        const wrapperStyle = window.getComputedStyle(wrapper);
        const paddingTop = parseFloat(wrapperStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(wrapperStyle.paddingBottom) || 0;
        wrapperPadding = paddingTop + paddingBottom;
      }

      // Add extra space during entering animation (10px buffer)
      const extraSpace = entering ? 10 : 0;

      /**
       * Header height + Footer height + Dialog margin + Wrapper padding + Extra space
       */
      const excludeHeight = headerHeight + footerHeight + dialogMargin + wrapperPadding + extraSpace;
      const bodyHeight = getHeight(window) - excludeHeight;

      // Always set maxHeight to available space, let browser handle content that's smaller
      styles.maxHeight = bodyHeight;
    }
    setBodyStyles(styles);
  }, [prefix, ref]);
  const onDestroyEvents = useCallback(() => {
    var _windowResizeListener, _windowResizeListener2, _contentElementResize;
    (_windowResizeListener = windowResizeListener.current) === null || _windowResizeListener === void 0 || (_windowResizeListener2 = _windowResizeListener.off) === null || _windowResizeListener2 === void 0 || _windowResizeListener2.call(_windowResizeListener);
    (_contentElementResize = contentElementResizeObserver.current) === null || _contentElementResize === void 0 || _contentElementResize.disconnect();
    windowResizeListener.current = null;
    contentElementResizeObserver.current = null;
  }, []);
  const onChangeBodyStyles = useCallback(entering => {
    if (!overflow || size === 'full') {
      setBodyStyles(null);
      return;
    }
    if (ref.current) {
      updateBodyStyles(undefined, entering);
      contentElement.current = ref.current.querySelector(`.${prefix('content')}`);
      if (!windowResizeListener.current) {
        windowResizeListener.current = on(window, 'resize', updateBodyStyles);
      }
      if (contentElement.current && !contentElementResizeObserver.current) {
        contentElementResizeObserver.current = new ResizeObserver(() => updateBodyStyles());
        contentElementResizeObserver.current.observe(contentElement.current);
      }
    }
  }, [overflow, prefix, ref, size, updateBodyStyles]);
  useEffect(() => {
    return onDestroyEvents;
  }, []);
  return [overflow ? bodyStyles : null, onChangeBodyStyles, onDestroyEvents];
};