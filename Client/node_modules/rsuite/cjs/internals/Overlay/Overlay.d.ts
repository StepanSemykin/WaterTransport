import React from 'react';
import type { Placement, AnimationEventProps } from '../types';
import type { CursorPosition, PositionChildProps } from './types';
export interface OverlayProps extends AnimationEventProps {
    container?: HTMLElement | (() => HTMLElement | null) | null;
    children: React.ReactElement | ((props: PositionChildProps & React.HTMLAttributes<HTMLElement>, ref: React.RefCallback<HTMLElement>) => React.ReactElement);
    childrenProps?: React.HTMLAttributes<HTMLElement>;
    className?: string;
    cursorPosition?: CursorPosition | null;
    containerPadding?: number;
    followCursor?: boolean;
    open?: boolean;
    placement?: Placement;
    preventOverflow?: boolean;
    rootClose?: boolean;
    triggerTarget?: React.RefObject<any>;
    transition?: React.ElementType;
    onClose?: React.ReactEventHandler;
}
/**
 * Overlay is a powerful component that helps you create floating components.
 * @private
 */
declare const Overlay: React.ForwardRefExoticComponent<OverlayProps & React.RefAttributes<unknown>>;
export default Overlay;
