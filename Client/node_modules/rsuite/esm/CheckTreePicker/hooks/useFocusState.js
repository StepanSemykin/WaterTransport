'use client';
import { useState } from 'react';
import { useEventCallback } from "../../internals/hooks/index.js";
function useFocusState(props) {
  const {
    target
  } = props;
  const [active, setActive] = useState(false);
  const [focusItemValue, setFocusItemValue] = useState(null);
  const focusTarget = useEventCallback(() => {
    var _target$current;
    (_target$current = target.current) === null || _target$current === void 0 || _target$current.focus();
  });
  const onEnter = useEventCallback(node => {
    var _props$onEnter;
    setActive(true);
    (_props$onEnter = props.onEnter) === null || _props$onEnter === void 0 || _props$onEnter.call(props, node);
  });
  const onExit = useEventCallback(node => {
    var _props$onExit;
    setActive(false);
    focusTarget();
    (_props$onExit = props.onExit) === null || _props$onExit === void 0 || _props$onExit.call(props, node);
  });
  return {
    active,
    focusItemValue,
    setFocusItemValue,
    triggerProps: {
      onEnter,
      onExit
    }
  };
}
export default useFocusState;