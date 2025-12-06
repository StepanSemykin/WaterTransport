'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import PanelGroup from "../PanelGroup/index.js";
import AccordionPanel from "./AccordionPanel.js";
import { forwardRef } from "../internals/utils/index.js";
import { useCustom } from "../internals/hooks/index.js";
const Subcomponents = {
  Panel: AccordionPanel
};

/**
 * The `Accordion` component is used to display content that can be collapsed.
 * @see https://rsuitejs.com/components/accordion
 */
const Accordion = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Accordion', props);
  return /*#__PURE__*/React.createElement(PanelGroup, _extends({
    accordion: true,
    ref: ref
  }, propsWithDefaults));
}, Subcomponents);
Accordion.displayName = 'Accordion';
export default Accordion;