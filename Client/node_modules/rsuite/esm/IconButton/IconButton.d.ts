import React from 'react';
import { ButtonProps } from '../Button';
import type { IconProps } from '@rsuite/icons/Icon';
export interface IconButtonProps extends ButtonProps {
    /** Set the icon */
    icon?: React.ReactElement<IconProps>;
    /** Set circle button */
    circle?: boolean;
    /** The placement of icon */
    placement?: 'left' | 'right' | 'start' | 'end';
}
/**
 * The `IconButton` component is used to specify a button with icon.
 * @see https://rsuitejs.com/components/button
 */
declare const IconButton: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"button", ButtonProps, never> & Record<string, never>, IconButtonProps, never> & Record<string, never>;
export default IconButton;
