import { WithAsProps } from '../../internals/types';
import type { PlainDate } from '../../internals/utils/date';
export interface GridProps extends WithAsProps {
    rows: readonly PlainDate[];
}
declare const Grid: import("../../internals/types").InternalRefForwardingComponent<"div", GridProps, never> & Record<string, never>;
export default Grid;
