'use client';
import { useState, useRef } from 'react';
import { useMount, useEventCallback } from "../../hooks/index.js";
function getScrollState(target) {
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;
  if (scrollHeight <= clientHeight) {
    return null;
  } else if (scrollTop === 0) {
    return 'top';
  } else if (scrollTop + clientHeight === scrollHeight) {
    return 'bottom';
  } else {
    return 'middle';
  }
}
export function useScrollState(scrollShadow) {
  const bodyRef = useRef(null);
  const [scrollState, setScrollState] = useState(null);
  useMount(() => {
    let observer;
    if (bodyRef.current && scrollShadow) {
      const target = bodyRef.current;
      setScrollState(getScrollState(target));
      let lastScrollHeight = target.scrollHeight;

      // Listen for changes in scrollHeight
      observer = new MutationObserver(() => {
        const newScrollHeight = target === null || target === void 0 ? void 0 : target.scrollHeight;
        if (newScrollHeight && newScrollHeight !== lastScrollHeight) {
          setScrollState(getScrollState(target));
          lastScrollHeight = newScrollHeight;
        }
      });
      observer.observe(target, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }
    return () => {
      var _observer;
      (_observer = observer) === null || _observer === void 0 || _observer.disconnect();
    };
  });
  const handleScroll = useEventCallback(event => {
    const target = event.currentTarget;
    setScrollState(getScrollState(target));
  });
  return {
    scrollState,
    handleScroll: scrollShadow ? handleScroll : undefined,
    bodyRef
  };
}