import { BoxProps } from '../internals/Box';
export interface TabPanelProps extends BoxProps {
    /** The active state of the tab. */
    active?: boolean;
    /** The HTML id attribute, which should be unique. */
    id?: string;
}
declare const TabPanel: import("../internals/types").InternalRefForwardingComponent<"div", TabPanelProps, never> & Record<string, never>;
export default TabPanel;
