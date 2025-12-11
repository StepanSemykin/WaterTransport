'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import PanelHeader from "./PanelHeader.js";
import PanelBody from "./PanelBody.js";
import useExpanded from "./hooks/useExpanded.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useUniqueId, useEventCallback } from "../internals/hooks/index.js";
import { PanelGroupContext } from "../PanelGroup/index.js";
/**
 * The `Panel` component is used to display content that can be collapsed.
 * @see https://rsuitejs.com/components/panel
 */
const Panel = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Panel', props);
  const {
    as,
    bodyFill,
    bodyProps,
    bordered,
    children,
    className,
    classPrefix = 'panel',
    caretAs,
    collapsible: collapsibleProp,
    defaultExpanded,
    disabled,
    eventKey,
    expanded: expandedProp,
    header,
    headerRole,
    panelRole = 'region',
    shaded,
    scrollShadow,
    id: idProp,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
    onSelect,
    ...rest
  } = propsWithDefaults;
  const id = useUniqueId('rs-', idProp);
  const bodyId = `${id}-panel`;
  const buttonId = `${id}-btn`;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const {
    onGroupSelect
  } = useContext(PanelGroupContext) || {};
  const [expanded, setExpanded, collapsible] = useExpanded({
    expanded: expandedProp,
    defaultExpanded,
    eventKey,
    collapsible: collapsibleProp
  });
  const handleSelect = useEventCallback(event => {
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
    onGroupSelect === null || onGroupSelect === void 0 || onGroupSelect(eventKey, event);
    setExpanded(!expanded);
  });
  const classes = merge(className, withPrefix({
    in: expanded,
    collapsible,
    bordered,
    shaded
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    id: idProp
  }, rest), header && /*#__PURE__*/React.createElement(PanelHeader, {
    collapsible: collapsible,
    expanded: expanded,
    caretAs: caretAs,
    role: headerRole,
    buttonId: buttonId,
    bodyId: bodyId,
    disabled: disabled,
    onClickButton: handleSelect
  }, header), /*#__PURE__*/React.createElement(PanelBody, _extends({
    collapsible: collapsible,
    expanded: expanded,
    bodyFill: bodyFill,
    role: panelRole,
    id: bodyId,
    scrollShadow: scrollShadow,
    labelId: buttonId,
    onEnter: onEnter,
    onEntering: onEntering,
    onEntered: onEntered,
    onExit: onExit,
    onExiting: onExiting,
    onExited: onExited
  }, bodyProps), children));
});
Panel.displayName = 'Panel';
export default Panel;