import type { Offset, Placement } from '../../types';
import type { CursorPosition, PositionOptions, PositionType } from '../types';
export declare const AutoPlacement: {
    readonly left: "Start";
    readonly right: "End";
    readonly top: "Start";
    readonly bottom: "End";
};
export declare function calcPosition(options: PositionOptions): {
    getPosition(target: HTMLElement, container: HTMLElement): import("dom-lib/getOffset").Offset | DOMRect | null;
    getCursorOffsetPosition(target: HTMLElement, container: HTMLElement, cursorPosition: CursorPosition): Offset;
    /**
     * Calculate the optimal auto placement position
     * @param targetOffset Target element offset
     * @param container Container element
     * @param overlay Overlay dimensions
     * @returns Calculated optimal placement position
     */
    calcAutoPlacement(targetOffset: Offset, container: HTMLElement, overlay: {
        width: number;
        height: number;
    }): Placement;
    calcOverlayPosition(overlayNode: HTMLElement, target: HTMLElement, container: HTMLElement, cursorPosition?: CursorPosition | null): PositionType;
};
