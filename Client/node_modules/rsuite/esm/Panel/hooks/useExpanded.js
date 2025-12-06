'use client';
import { useEffect, useContext } from 'react';
import { PanelGroupContext } from "../../PanelGroup/index.js";
import { useControlled } from "../../internals/hooks/index.js";
function useExpanded(props) {
  const {
    expanded: expandedProp,
    defaultExpanded,
    eventKey,
    collapsible: collapsibleProp
  } = props;
  const {
    accordion,
    activeKey
  } = useContext(PanelGroupContext) || {};
  const [expandedState, setExpanded] = useControlled(expandedProp, defaultExpanded || typeof activeKey !== 'undefined' && activeKey === eventKey);
  let collapsible = collapsibleProp;
  let expanded = expandedState;
  if (accordion) {
    collapsible = true;
  }
  if (collapsible) {
    if (typeof activeKey !== 'undefined' && activeKey !== eventKey) {
      expanded = false;
    }
  }
  useEffect(() => {
    if (accordion && typeof activeKey !== 'undefined') {
      setExpanded(activeKey === eventKey);
    }
  }, [accordion, activeKey, eventKey, setExpanded]);
  return [expanded, setExpanded, collapsible];
}
export default useExpanded;