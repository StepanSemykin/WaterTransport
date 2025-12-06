import { BoxProps } from '../internals/Box';
export interface CenterProps extends BoxProps {
    inline?: boolean;
}
declare const Center: import("../internals/types").InternalRefForwardingComponent<"div", CenterProps, never> & Record<string, never>;
export default Center;
