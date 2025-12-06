import React from 'react';
import { BoxProps } from '../internals/Box';
export interface GraduatedProps extends BoxProps {
    step: number;
    min: number;
    max: number;
    count: number;
    value: number | number[];
    marks?: {
        value: number;
        label: React.ReactNode;
    }[];
    renderMark?: (mark: number) => React.ReactNode;
}
declare const Graduated: import("../internals/types").InternalRefForwardingComponent<"div", GraduatedProps, never> & Record<string, never>;
export default Graduated;
