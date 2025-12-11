import React from 'react';
import { BoxProps } from '../internals/Box';
export interface HandleProps extends Omit<BoxProps, 'color' | 'position' | 'height' | 'width'>, React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    vertical?: boolean;
    tooltip?: boolean;
    position?: number;
    value?: number;
    keepTooltipOpen?: boolean;
    renderTooltip?: (value: number | undefined) => React.ReactNode;
    onDragMove?: (event: React.DragEvent, dataset?: DOMStringMap) => void;
    onDragStart?: (event: React.MouseEvent) => void;
    onDragEnd?: (event: React.MouseEvent, dataset?: DOMStringMap) => void;
    'data-range'?: number[];
    'data-key'?: string;
}
declare const Handle: import("../internals/types").InternalRefForwardingComponent<"div", HandleProps, never> & Record<string, never>;
export default Handle;
