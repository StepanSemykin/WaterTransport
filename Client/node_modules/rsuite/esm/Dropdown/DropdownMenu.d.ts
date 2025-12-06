import React from 'react';
import type { StandardProps, SanitizedHTMListProps } from '../internals/types';
import type { IconProps } from '@rsuite/icons/Icon';
export interface DropdownMenuProps<T = string | number> extends StandardProps {
    /** Define the title as a submenu */
    title?: React.ReactNode;
    /** Only used for setting the default expand state when it's a submenu */
    eventKey?: T;
    /** Set the icon for the dropdown menu */
    icon?: React.ReactElement<IconProps>;
    /** Set the active state of the dropdown menu */
    active?: boolean;
    /** Disable the dropdown menu */
    disabled?: boolean;
    /** Set the active key for the dropdown menu */
    activeKey?: T;
    /** Define the trigger action for the dropdown menu */
    trigger?: 'hover' | 'click';
    /** Callback function when an item is selected */
    onSelect?: (eventKey: T | undefined, event: React.SyntheticEvent) => void;
    /** Callback function when the dropdown menu is toggled */
    onToggle?: (eventKey: T | undefined, event: React.SyntheticEvent) => void;
}
/**
 * The `<Dropdown.Menu>` API
 *
 * @description
 * Note the difference between this component and `<Menu>` component:
 * `<Menu>` is used for ARIA menu control logic and is used internally only.
 * This component is only used for supporting submenu syntax and is
 * assigned to Dropdown.Menu
 *
 * @example
 *
 * <Dropdown>
 *   <Dropdown.Item>Item 1</Dropdown.Item>
 *   <Dropdown.Menu title="Submenu">
 *     <Dropdown.Item>Sub item</Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 */
declare const DropdownMenu: React.ForwardRefExoticComponent<DropdownMenuProps<string | number> & SanitizedHTMListProps<HTMLElement, React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>>;
export default DropdownMenu;
