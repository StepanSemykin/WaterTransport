'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Nav from "../Nav/index.js";
import Tab from "./Tab.js";
import TabPanel from "./TabPanel.js";
import Box from "../internals/Box/index.js";
import { forwardRef, rch } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback, useUniqueId } from "../internals/hooks/index.js";

/**
 * Props for the Tabs component.
 */

function getFocusableTabs(tablist) {
  const tabs = tablist === null || tablist === void 0 ? void 0 : tablist.querySelectorAll('[role=tab]');
  return Array.from(tabs).filter(tab => !(tab.getAttribute('aria-disabled') === 'true'));
}
function getFocusedTab(tablist) {
  const tabs = getFocusableTabs(tablist);
  return tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
}
function nextItem(tablist) {
  if (!tablist) {
    return null;
  }
  const item = getFocusedTab(tablist);
  const items = getFocusableTabs(tablist);
  if (!item) {
    return items[0];
  }
  const nextItem = items[items.indexOf(item) + 1];
  if (!nextItem || nextItem.getAttribute('role') !== 'tab') {
    return items[0];
  }
  return nextItem;
}
function previousItem(tablist) {
  if (!tablist) {
    return null;
  }
  const item = getFocusedTab(tablist);
  const items = getFocusableTabs(tablist);
  if (!item) {
    return items[items.length - 1];
  }
  const previousItem = items[items.indexOf(item) - 1];
  if (!previousItem || previousItem.getAttribute('role') !== 'tab') {
    return items[items.length - 1];
  }
  return previousItem;
}
const renderPanels = (children, tabProps) => {
  const {
    id,
    activeKey
  } = tabProps;
  return rch.map(children, child => {
    const {
      eventKey,
      children
    } = child.props;
    const selected = eventKey === activeKey;
    return /*#__PURE__*/React.createElement(TabPanel, {
      "aria-labelledby": `${id}-${eventKey}`,
      "aria-hidden": !selected,
      id: `${id}-panel-${eventKey}`,
      active: selected
    }, children);
  });
};
const renderTabs = (children, tabPanelProps) => {
  const {
    id,
    activeKey
  } = tabPanelProps;
  return rch.map(children, child => {
    const {
      eventKey,
      title,
      disabled,
      icon
    } = child.props;
    const selected = eventKey === activeKey;
    return /*#__PURE__*/React.createElement(Nav.Item, {
      role: "tab",
      as: "button",
      type: "button",
      "aria-selected": selected,
      "aria-controls": `${id}-panel-${eventKey}`,
      "aria-disabled": disabled,
      "data-event-key": eventKey,
      disabled: disabled,
      icon: icon,
      id: `${id}-${eventKey}`,
      tabIndex: selected ? undefined : -1,
      eventKey: eventKey
    }, title);
  });
};
const Subcomponents = {
  Tab
};

/**
 * Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time.
 *
 * @version 5.53.0
 * @see https://rsuitejs.com/components/tabs
 */
const Tabs = forwardRef((props, ref) => {
  const {
    propsWithDefaults,
    rtl
  } = useCustom('Tabs', props);
  const {
    as,
    classPrefix = 'tabs',
    appearance = 'tabs',
    className,
    children,
    activeKey: activeKeyProp,
    defaultActiveKey,
    id: idProp,
    reversed,
    vertical,
    onSelect,
    ...rest
  } = propsWithDefaults;
  const id = useUniqueId('tab-', idProp);
  const [activeKey, setActiveKey] = useControlled(activeKeyProp, defaultActiveKey);
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const tablistRef = React.useRef(null);
  const handleSelect = useEventCallback((eventKey, event) => {
    setActiveKey(eventKey);
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
  });
  const handleKeyDown = useEventCallback(event => {
    var _getFocusableTabs;
    const target = event.target;
    if (target.getAttribute('role') !== 'tab') {
      return;
    }
    let previousItemKey = vertical ? 'ArrowUp' : 'ArrowLeft';
    let nextItemKey = vertical ? 'ArrowDown' : 'ArrowRight';
    if (!vertical && rtl) {
      previousItemKey = 'ArrowRight';
      nextItemKey = 'ArrowLeft';
    }
    let item = null;
    switch (event.key) {
      case previousItemKey:
        item = previousItem(tablistRef.current);
        event.preventDefault();
        break;
      case nextItemKey:
        item = nextItem(tablistRef.current);
        event.preventDefault();
        break;
      case 'Home':
        item = (_getFocusableTabs = getFocusableTabs(tablistRef.current)) === null || _getFocusableTabs === void 0 ? void 0 : _getFocusableTabs[0];
        event.preventDefault();
        break;
      case 'End':
        {
          const tabs = getFocusableTabs(tablistRef.current);
          item = tabs[tabs.length - 1];
          event.preventDefault();
          break;
        }
    }
    if (item) {
      const eventKey = item ? item.dataset.eventKey : undefined;
      handleSelect(eventKey, event);
      item.focus();
    }
  });
  const hasChildren = React.Children.toArray(children).some(child => /*#__PURE__*/React.isValidElement(child) && child.props.children);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    className: merge(className, withPrefix({
      reversed,
      vertical
    }))
  }, rest, {
    ref: ref
  }), /*#__PURE__*/React.createElement(Nav, {
    role: "tablist",
    "aria-orientation": vertical ? 'vertical' : 'horizontal',
    reversed: reversed,
    vertical: vertical,
    appearance: appearance,
    activeKey: activeKey,
    onSelect: handleSelect,
    onKeyDown: handleKeyDown,
    ref: tablistRef
  }, renderTabs(children, {
    id,
    activeKey
  })), hasChildren && /*#__PURE__*/React.createElement("div", {
    className: prefix`content`
  }, renderPanels(children, {
    id,
    activeKey
  })));
}, Subcomponents);
Tabs.displayName = 'Tabs';
export default Tabs;