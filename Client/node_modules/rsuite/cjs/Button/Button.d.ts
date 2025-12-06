import React from 'react';
import { BoxProps } from '../internals/Box';
import { Color, BasicSize, AppearanceType } from '../internals/types';
export interface ButtonProps extends BoxProps, Omit<React.HTMLAttributes<HTMLElement>, 'onToggle'> {
    /** A button can have different appearances. */
    appearance?: AppearanceType;
    /** A button can show it is currently the active user selection */
    active?: boolean;
    /** A button can have different sizes */
    size?: BasicSize;
    /** A button can have different colors */
    color?: Color;
    /** Format button to appear inside a content block */
    block?: boolean;
    /** Providing a `href` will render an `<a>` element, _styled_ as a button */
    href?: string;
    /** Where to display the linked URL */
    target?: string;
    /** A button can show a loading indicator */
    loading?: boolean;
    /** A button can show it is currently unable to be interacted with */
    disabled?: boolean;
    /** Ripple after button click */
    ripple?: boolean;
    /** The icon element placed _before_ the button text */
    startIcon?: React.ReactNode;
    /** The icon element placed _after_ the button text */
    endIcon?: React.ReactNode;
    /** Defines HTML button type attribute */
    type?: 'button' | 'reset' | 'submit';
    /** A button can toggle its state between active and inactive. */
    toggleable?: boolean;
    /** Called when the button is clicked */
    onToggle?: (active: boolean, event: React.MouseEvent) => void;
}
/**
 * The Button component is used to trigger a custom action.
 * @see https://rsuitejs.com/components/button
 */
declare const Button: import("../internals/types").InternalRefForwardingComponent<"button", ButtonProps, never> & Record<string, never>;
export default Button;
