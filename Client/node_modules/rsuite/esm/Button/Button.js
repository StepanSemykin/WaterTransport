'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useMemo } from 'react';
import Ripple from "../internals/Ripple/index.js";
import Box from "../internals/Box/index.js";
import SafeAnchor from "../internals/SafeAnchor/index.js";
import { ButtonGroupContext } from "../ButtonGroup/index.js";
import { forwardRef, isOneOf, isDisableableElement } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
/**
 * The Button component is used to trigger a custom action.
 * @see https://rsuitejs.com/components/button
 */
const Button = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Button', props);
  const buttonGroup = useContext(ButtonGroupContext);
  const {
    as,
    active: activeProp,
    appearance = 'default',
    block,
    className,
    children,
    classPrefix = 'btn',
    color,
    disabled = buttonGroup === null || buttonGroup === void 0 ? void 0 : buttonGroup.disabled,
    loading,
    role,
    ripple = true,
    size = (buttonGroup === null || buttonGroup === void 0 ? void 0 : buttonGroup.size) || 'md',
    startIcon,
    endIcon,
    type: typeProp,
    toggleable,
    onToggle,
    onClick,
    ...rest
  } = propsWithDefaults;
  const [active, setActive] = useControlled(activeProp, false);
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const buttonContent = useMemo(() => {
    const spin = /*#__PURE__*/React.createElement("span", {
      className: prefix`spin`
    });
    const rippleElement = ripple && !isOneOf(appearance, ['link', 'ghost']) ? /*#__PURE__*/React.createElement(Ripple, null) : null;
    return /*#__PURE__*/React.createElement(React.Fragment, null, loading && spin, startIcon ? /*#__PURE__*/React.createElement("span", {
      className: prefix`start-icon`
    }, startIcon) : null, children, endIcon ? /*#__PURE__*/React.createElement("span", {
      className: prefix`end-icon`
    }, endIcon) : null, rippleElement);
  }, [appearance, children, endIcon, loading, prefix, ripple, startIcon]);
  const handleClick = useEventCallback(event => {
    if (toggleable) {
      const nextActive = !active;
      setActive(nextActive);
      onToggle === null || onToggle === void 0 || onToggle(nextActive, event);
    }
    onClick === null || onClick === void 0 || onClick(event);
  });
  const buttonAs = as || (rest.href ? SafeAnchor : 'button');
  const isCustomElement = buttonAs !== 'button' && buttonAs !== SafeAnchor;
  const uncertainProps = {
    [isDisableableElement(buttonAs) || buttonAs === SafeAnchor ? 'disabled' : 'aria-disabled']: disabled,
    type: typeProp !== null && typeProp !== void 0 ? typeProp : buttonAs === 'button' ? 'button' : undefined,
    role: role !== null && role !== void 0 ? role : isCustomElement ? 'button' : undefined
  };
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: buttonAs,
    ref: ref,
    className: classes,
    onClick: handleClick,
    "data-appearance": appearance,
    "data-color": color,
    "data-size": size,
    "data-block": block,
    "data-active": active || undefined,
    "data-disabled": disabled,
    "data-loading": loading
  }, uncertainProps, rest), buttonContent);
});
Button.displayName = 'Button';
export default Button;