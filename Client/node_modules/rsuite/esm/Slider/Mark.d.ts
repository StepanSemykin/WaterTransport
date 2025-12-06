import React from 'react';
import { BoxProps } from '../internals/Box';
export interface MarkProps extends BoxProps {
    mark: number;
    last?: boolean;
    renderMark?: (mark: number) => React.ReactNode;
}
declare const Mark: import("../internals/types").InternalRefForwardingComponent<"span", MarkProps, never> & Record<string, never>;
export default Mark;
