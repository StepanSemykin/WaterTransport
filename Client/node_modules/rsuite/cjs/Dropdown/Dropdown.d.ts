import React from 'react';
import Button from '../Button';
import DropdownMenu from './DropdownMenu';
import DropdownItem from './DropdownItem';
import DropdownSeparator from './DropdownSeparator';
import { IconProps } from '@rsuite/icons/Icon';
import type { PlacementCorners, WithAsProps, InternalRefForwardingComponent, SanitizedHTMListProps } from '../internals/types';
export type DropdownTrigger = 'click' | 'hover' | 'contextMenu';
interface DeprecatedDropdownProps {
    /**
     * Deprecated. Use `renderToggle` instead.
     * @deprecated
     */
    renderTitle?: (children: React.ReactNode) => React.ReactNode;
}
export interface DropdownProps<T = any> extends WithAsProps, DeprecatedDropdownProps, SanitizedHTMListProps {
    /** The active option, corresponding to the eventKey in Dropdown.Item */
    activeKey?: T;
    /** Default open state */
    defaultOpen?: boolean;
    /** Whether to disable the component */
    disabled?: boolean;
    /** The value of the current option */
    eventKey?: T;
    /** Set icon */
    icon?: React.ReactElement<IconProps>;
    /** Menu style */
    menuStyle?: React.CSSProperties;
    /** Do not display caret */
    noCaret?: boolean;
    /** Controlled open state */
    open?: boolean;
    /** Menu position */
    placement?: PlacementCorners;
    /** Define the title of the submenu */
    title?: React.ReactNode;
    /** Toggle component class name */
    toggleClassName?: string;
    /** Custom element type can be used for this toggle component */
    toggleAs?: React.ElementType;
    /** Trigger event */
    trigger?: DropdownTrigger | DropdownTrigger[];
    /** Custom toggle component */
    renderToggle?: (props: WithAsProps, ref: React.Ref<any>) => any;
    /** Callback function for closing the menu */
    onClose?: () => void;
    /** Callback function for opening the menu */
    onOpen?: () => void;
    /** Selection callback function */
    onSelect?: (eventKey: T | undefined, event: React.SyntheticEvent) => void;
    /** Callback function for menu state toggle */
    onToggle?: (open?: boolean) => void;
}
export interface DropdownComponent extends InternalRefForwardingComponent<'div', DropdownProps> {
    <ToggleAs extends React.ElementType = typeof Button>(props: DropdownProps & {
        ref?: React.Ref<any>;
        toggleAs?: ToggleAs;
    } & React.ComponentProps<ToggleAs>, context: any): React.ReactElement | null;
    Item: typeof DropdownItem;
    Menu: typeof DropdownMenu;
    Separator: typeof DropdownSeparator;
}
/**
 * The `Dropdown` component is used to select an option from a set of options.
 * @see https://rsuitejs.com/components/dropdown
 *
 * The `<Dropdown>` API
 * - When used inside `<Sidenav>`, renders a `<TreeviewRootItem>`;
 * - Otherwise renders a `<MenuRoot>`
 */
declare const Dropdown: DropdownComponent;
export default Dropdown;
