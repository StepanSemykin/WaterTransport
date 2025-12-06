import React from 'react';
import { BoxProps } from '../internals/Box';
export interface PasswordStrengthMeterProps extends BoxProps {
    /** The strength level of the password (0-3) */
    level?: 0 | 1 | 2 | 3;
    /** Label to display below the strength meter */
    label?: React.ReactNode;
    /** Maximum number of segments in the strength meter */
    max?: number;
}
declare const PasswordStrengthMeter: import("../internals/types").InternalRefForwardingComponent<"div", PasswordStrengthMeterProps, never> & Record<string, never>;
export default PasswordStrengthMeter;
