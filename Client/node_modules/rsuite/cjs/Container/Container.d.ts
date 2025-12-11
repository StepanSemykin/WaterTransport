import React from 'react';
import { BoxProps } from '../internals/Box';
export type ContainerProps = BoxProps & React.HTMLAttributes<HTMLDivElement>;
export declare const ContainerContext: React.Context<ContainerContextValue>;
interface ContainerContextValue {
    setHasSidebar?: (value: boolean) => void;
}
/**
 * The Container component is used to wrap content in a themed container with a max-width.
 * @see https://rsuitejs.com/components/container
 */
declare const Container: import("../internals/types").InternalRefForwardingComponent<"section", ContainerProps, never> & Record<string, never>;
export default Container;
