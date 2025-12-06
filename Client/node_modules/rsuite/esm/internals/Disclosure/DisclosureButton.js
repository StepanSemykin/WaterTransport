'use client';
import { useCallback, useRef } from 'react';
import { DisclosureActionTypes } from "./DisclosureContext.js";
import { KEY_VALUES } from "../constants/index.js";
import useDisclosureContext from "./useDisclosureContext.js";
function DisclosureButton(props) {
  const {
    children
  } = props;
  const buttonRef = useRef(null);
  const [{
    open
  }, dispatch, {
    onToggle
  }] = useDisclosureContext(DisclosureButton.displayName);
  const toggle = useCallback(event => {
    if (!open) {
      dispatch({
        type: DisclosureActionTypes.Show
      });
      onToggle === null || onToggle === void 0 || onToggle(true, event);
    } else {
      dispatch({
        type: DisclosureActionTypes.Hide
      });
      onToggle === null || onToggle === void 0 || onToggle(false, event);
    }
  }, [open, dispatch, onToggle]);
  const onClick = useCallback(event => {
    toggle(event);
  }, [toggle]);
  const onKeyDown = useCallback(event => {
    switch (event.key) {
      case KEY_VALUES.ENTER:
      case KEY_VALUES.SPACE:
        event.preventDefault();
        event.stopPropagation();
        toggle(event);
        break;
    }
  }, [toggle]);
  return children({
    role: 'button',
    'aria-expanded': open,
    onClick,
    onKeyDown,
    open
  }, buttonRef);
}
DisclosureButton.displayName = 'Disclosure.Button';
export default DisclosureButton;