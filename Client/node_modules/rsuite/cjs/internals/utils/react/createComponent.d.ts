import React from 'react';
import Box, { BoxProps } from '../../Box/Box';
export type ComponentProps = BoxProps & React.HTMLAttributes<HTMLDivElement>;
interface Props<T extends React.ElementType> extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    componentAs?: T;
    componentClassPrefix?: string;
}
/**
 * Create a component with `classPrefix` and `as` attributes.
 * By default, the component is based on Box component and inherits all Box props.
 */
export declare function createComponent<T extends React.ElementType = typeof Box, P = ComponentProps>({ name, componentAs, componentClassPrefix, ...defaultProps }: Props<T> & Partial<P>): import("../../types").InternalRefForwardingComponent<T, Partial<P>, never> & Record<string, never>;
export default createComponent;
