'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Slide from "../Animation/Slide.js";
import Modal from "../Modal/index.js";
import DrawerBody from "./DrawerBody.js";
import DrawerHeader from "./DrawerHeader.js";
import DrawerActions from "./DrawerActions.js";
import DrawerFooter from "./DrawerFooter.js";
import DrawerTitle from "./DrawerTitle.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, deprecateComponent } from "../internals/utils/index.js";
const Subcomponents = {
  Body: DrawerBody,
  Header: DrawerHeader,
  Actions: DrawerActions,
  Title: DrawerTitle,
  /**
   * @deprecated use <Drawer.Actions> instead
   */
  Footer: deprecateComponent(DrawerFooter, '<Drawer.Footer> has been deprecated, use <Drawer.Actions> instead.')
};

/**
 * The Drawer component is used to display extra content from a main content.
 * @see https://rsuitejs.com/components/drawer
 */
const Drawer = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Drawer', props);
  const {
    className,
    placement = 'right',
    classPrefix = 'drawer',
    animation = Slide,
    closeButton = true,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, prefix(placement));
  const animationProps = {
    placement
  };
  return /*#__PURE__*/React.createElement(Modal, _extends({}, rest, {
    ref: ref,
    overflow: false,
    classPrefix: classPrefix,
    className: classes,
    animation: animation,
    animationProps: animationProps,
    isDrawer: true,
    closeButton: closeButton
  }));
}, Subcomponents);
Drawer.displayName = 'Drawer';
export default Drawer;