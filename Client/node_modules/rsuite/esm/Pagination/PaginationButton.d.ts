import React from 'react';
import { ButtonProps } from '../Button';
export interface PaginationButtonProps<T = number | string> extends Omit<ButtonProps, 'onSelect'> {
    /** The value of the current option */
    eventKey: T;
    /** A button can show it is currently unable to be interacted with */
    disabled?: boolean;
    /** A button can show it is currently the active user selection */
    active?: boolean;
    /** Primary content */
    children?: React.ReactNode;
    /** Called when the button is clicked */
    onClick?: React.MouseEventHandler<HTMLElement>;
    /** Select the callback function for the current option */
    onSelect?: (eventKey: T, event: React.MouseEvent<HTMLElement>) => void;
}
/**
 * PaginationButton component for pagination navigation.
 * Renders a button that can be used in pagination contexts.
 */
declare const PaginationButton: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"button", ButtonProps, never> & Record<string, never>, PaginationButtonProps<string | number>, never> & Record<string, never>;
export default PaginationButton;
