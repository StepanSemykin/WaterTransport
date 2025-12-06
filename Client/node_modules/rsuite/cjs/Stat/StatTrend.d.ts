import { BoxProps } from '../internals/Box';
export interface StatTrendProps extends BoxProps {
    indicator?: 'up' | 'down' | 'equal';
    appearance?: 'default' | 'subtle';
}
declare const StatTrend: import("../internals/types").InternalRefForwardingComponent<"dd", StatTrendProps, never> & Record<string, never>;
export default StatTrend;
