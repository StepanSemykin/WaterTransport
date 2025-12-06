'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import canUseDOM from 'dom-lib/canUseDOM';
const MountedPortal = /*#__PURE__*/React.memo(function MountedPortal({
  children,
  container
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (container && mounted) {
    return /*#__PURE__*/createPortal(children, container);
  }
  return null;
});
export function usePortal(props = {}) {
  const {
    container,
    waitMount = false
  } = props;
  const containerElement = typeof container === 'function' ? container() : container;
  const rootElement = useMemo(() => canUseDOM ? containerElement || document.body : null, [containerElement]);
  const Portal = useCallback(({
    children
  }) => {
    return rootElement != null ? /*#__PURE__*/createPortal(children, rootElement) : null;
  }, [rootElement]);
  const WaitMountPortal = useCallback(props => /*#__PURE__*/React.createElement(MountedPortal, _extends({
    container: rootElement
  }, props)), [rootElement]);
  return {
    target: rootElement,
    Portal: waitMount ? WaitMountPortal : Portal
  };
}
export default usePortal;