import React from 'react';
import type { Placement } from '../types';
import type { CursorPosition, PositionChildProps } from './types';
export declare const getPositionStyle: (x?: number, y?: number) => {
    "--rs-position-x": string | undefined;
    "--rs-position-y": string | undefined;
};
export interface PositionProps {
    children: (props: PositionChildProps, ref: React.RefObject<HTMLElement | null>) => React.ReactElement;
    container?: HTMLElement | (() => HTMLElement | null) | null;
    containerPadding?: number;
    placement?: Placement;
    preventOverflow?: boolean;
    triggerTarget?: React.RefObject<any>;
    followCursor?: boolean;
    cursorPosition?: CursorPosition | null;
}
export interface PositionInstance {
    updatePosition?: () => void;
    child?: Element;
}
/**
 * The `Position` component calculates the position of the child element.
 * @private
 */
declare const Position: React.ForwardRefExoticComponent<PositionProps & React.RefAttributes<unknown>>;
export default Position;
