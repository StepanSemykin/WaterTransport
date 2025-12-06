import React from 'react';
import { BoxProps } from '../internals/Box';
/**
 * Props for the Tabs component.
 */
export interface TabsProps extends BoxProps {
    /**
     * The appearance of the tabs.
     * - 'pills' appearance is deprecated. Use `SegmentedControl` component instead.
     *
     * @default 'tabs'
     *
     */
    appearance?: 'tabs' | 'subtle';
    /**
     * The key of the active tab.
     */
    activeKey?: string | number;
    /**
     * The default key of the active tab.
     */
    defaultActiveKey?: string | number;
    /**
     * Whether to reverse the order of the tabs.
     */
    reversed?: boolean;
    /**
     * Whether to display the tabs vertically.
     */
    vertical?: boolean;
    /**
     * The ID of the tabs.
     * @default A unique ID is automatically generated.
     */
    id?: string;
    /**
     * Callback function that is called when a tab is selected.
     *
     * @param eventKey - The key of the selected tab.
     * @param event - The event object.
     */
    onSelect?: (eventKey: string | number | undefined, event: React.SyntheticEvent) => void;
}
/**
 * Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time.
 *
 * @version 5.53.0
 * @see https://rsuitejs.com/components/tabs
 */
declare const Tabs: import("../internals/types").InternalRefForwardingComponent<"div", TabsProps, never> & {
    Tab: React.FC<import("./Tab").TabProps>;
};
export default Tabs;
