import React from 'react';
import type { WithAsProps, AnimationEventProps } from '../internals/types';
export interface PanelBodyProps extends WithAsProps, AnimationEventProps, React.HTMLAttributes<HTMLDivElement> {
    collapsible?: boolean;
    expanded?: boolean;
    bodyFill?: boolean;
    scrollShadow?: boolean;
    role?: string;
    id?: string;
    labelId?: string;
}
declare const PanelBody: (props: PanelBodyProps) => React.JSX.Element;
export default PanelBody;
