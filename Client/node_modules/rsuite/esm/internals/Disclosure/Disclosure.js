'use client';
// Headless Disclosure
// Ref: https://w3c.github.io/aria-practices/#disclosure
import React, { useMemo, useReducer, useRef, useCallback, useContext } from 'react';
import DisclosureContext, { DisclosureActionTypes } from "./DisclosureContext.js";
import DisclosureButton from "./DisclosureButton.js";
import DisclosureContent from "./DisclosureContent.js";
import useClickOutside from "../hooks/useClickOutside.js";
const initialDisclosureState = {
  open: false
};
function disclosureReducer(state, action) {
  switch (action.type) {
    case DisclosureActionTypes.Show:
      return {
        ...state,
        open: true
      };
    case DisclosureActionTypes.Hide:
      return {
        ...state,
        open: false
      };
  }
  return state;
}
const Disclosure = /*#__PURE__*/React.memo(props => {
  const {
    children,
    open: openProp,
    defaultOpen = false,
    hideOnClickOutside = false,
    onToggle,
    trigger = ['click']
  } = props;
  const parentDisclosure = useContext(DisclosureContext);
  const [{
    open: openState
  }, dispatch] = useReducer(disclosureReducer, {
    ...initialDisclosureState,
    open: defaultOpen
  });
  const containerElementRef = useRef(null);
  const open = openProp !== null && openProp !== void 0 ? openProp : openState;
  useClickOutside({
    enabled: hideOnClickOutside,
    isOutside: event => {
      var _containerElementRef$;
      return !((_containerElementRef$ = containerElementRef.current) !== null && _containerElementRef$ !== void 0 && _containerElementRef$.contains(event.target));
    },
    handle: () => dispatch({
      type: DisclosureActionTypes.Hide
    })
  });
  const onMouseEnter = useCallback(event => {
    if (!open) {
      dispatch({
        type: DisclosureActionTypes.Show
      });
      onToggle === null || onToggle === void 0 || onToggle(true, event);
    }
  }, [open, dispatch, onToggle]);
  const onMouseLeave = useCallback(event => {
    if (open) {
      dispatch({
        type: DisclosureActionTypes.Hide
      });
      onToggle === null || onToggle === void 0 || onToggle(false, event);
    }
  }, [open, dispatch, onToggle]);
  const contextValue = useMemo(() => {
    const cascadeDispatch = action => {
      const result = dispatch(action);
      if ('cascade' in action) {
        parentDisclosure === null || parentDisclosure === void 0 || parentDisclosure[1](action);
      }
      return result;
    };
    return [{
      open
    }, cascadeDispatch, {
      onToggle,
      trigger
    }];
  }, [parentDisclosure, open, dispatch, onToggle, trigger]);
  const renderProps = useMemo(() => {
    const renderProps = {
      open
    };
    if (trigger.includes('hover')) {
      renderProps.onMouseEnter = onMouseEnter;
      renderProps.onMouseLeave = onMouseLeave;
    }
    return renderProps;
  }, [open, trigger, onMouseEnter, onMouseLeave]);
  return /*#__PURE__*/React.createElement(DisclosureContext.Provider, {
    value: contextValue
  }, children(renderProps, containerElementRef));
});
Disclosure.displayName = 'Disclosure';
Disclosure.Button = DisclosureButton;
Disclosure.Content = DisclosureContent;
export default Disclosure;