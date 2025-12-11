import React from 'react';
import type { PlainDate } from '../../internals/utils/date';
import { WithAsProps } from '../../internals/types';
export interface GridCellProps extends WithAsProps {
    date: PlainDate;
    disabled?: boolean;
    selected?: boolean;
    unSameMonth?: boolean;
    rangeStart?: boolean;
    rangeEnd?: boolean;
    inRange?: boolean;
    onSelect?: (date: PlainDate, disabled: boolean | void, event: React.MouseEvent) => void;
}
declare const GridCell: import("../../internals/types").InternalRefForwardingComponent<"div", GridCellProps, never> & Record<string, never>;
export default GridCell;
