import React from 'react';
import { StepItemProps } from './StepItem';
import { BoxProps } from '../internals/Box';
export interface StepsProps extends BoxProps {
    /** Vertical display */
    vertical?: boolean;
    /** Small size Step Bar */
    small?: boolean;
    /** Primary content */
    children?: React.ReactNode;
    /** Current execution step */
    current?: number;
    /** Current execution step status */
    currentStatus?: 'finish' | 'wait' | 'process' | 'error';
}
/**
 * The `Steps` component is used to guide users to complete tasks in accordance with the process.
 *
 * @see https://rsuitejs.com/components/steps
 */
declare const Steps: import("../internals/types").InternalRefForwardingComponent<"div", StepsProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", StepItemProps, never> & Record<string, never>;
};
export default Steps;
