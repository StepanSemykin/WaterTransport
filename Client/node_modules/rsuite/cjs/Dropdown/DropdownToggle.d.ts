import React from 'react';
import { IconProps } from '@rsuite/icons/Icon';
import { WithAsProps, PlacementCorners } from '../internals/types';
export interface DropdownToggleProps extends WithAsProps {
    icon?: React.ReactElement<IconProps>;
    noCaret?: boolean;
    renderToggle?: (props: WithAsProps, ref: React.Ref<any>) => any;
    placement?: PlacementCorners;
}
declare const DropdownToggle: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"button", import("../Button").ButtonProps, never> & Record<string, never>, DropdownToggleProps, never> & Record<string, never>;
export default DropdownToggle;
