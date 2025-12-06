import React from 'react';
import { BoxProps } from '../internals/Box';
export interface StatLabelProps extends BoxProps {
    /**
     * The info tip of the label
     */
    info?: React.ReactNode;
    /**
     * Uppercase the label
     */
    uppercase?: boolean;
}
declare const StatLabel: import("../internals/types").InternalRefForwardingComponent<"dt", StatLabelProps, never> & Record<string, never>;
export default StatLabel;
