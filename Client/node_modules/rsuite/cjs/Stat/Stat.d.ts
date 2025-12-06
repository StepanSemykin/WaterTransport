import React from 'react';
import { BoxProps } from '../internals/Box';
export interface StatProps extends BoxProps {
    /**
     * Add a border to the component.
     */
    bordered?: boolean;
    /**
     * The icon displayed on the left side of the component.
     */
    icon?: React.ReactNode;
}
declare const Stat: import("../internals/types").InternalRefForwardingComponent<"div", StatProps, never> & {
    Label: import("../internals/types").InternalRefForwardingComponent<"dt", import("./StatLabel").StatLabelProps, never> & Record<string, never>;
    Value: import("../internals/types").InternalRefForwardingComponent<"dd", import("./StatValue").StatValueProps, never> & Record<string, never>;
    Trend: import("../internals/types").InternalRefForwardingComponent<"dd", import("./StatTrend").StatTrendProps, never> & Record<string, never>;
    ValueUnit: import("../internals/types").InternalRefForwardingComponent<"span", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    HelpText: import("../internals/types").InternalRefForwardingComponent<"span", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
};
export default Stat;
