import { BoxProps } from '../internals/Box';
interface ProgressBarProps extends BoxProps {
    vertical?: boolean;
    start?: number;
    end?: number;
}
declare const ProgressBar: import("../internals/types").InternalRefForwardingComponent<"div", ProgressBarProps, never> & Record<string, never>;
export default ProgressBar;
