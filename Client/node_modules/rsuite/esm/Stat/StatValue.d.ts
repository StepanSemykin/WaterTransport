import { BoxProps } from '../internals/Box';
export interface StatValueProps extends BoxProps {
    value?: number;
    formatOptions?: Intl.NumberFormatOptions;
}
declare const StatValue: import("../internals/types").InternalRefForwardingComponent<"dd", StatValueProps, never> & Record<string, never>;
export default StatValue;
