import React from 'react';
import { OverlayTriggerProps, OverlayTriggerType } from '../Overlay/OverlayTrigger';
import type { Placement, Size, AnimationEventProps } from '../types';
export interface PickerToggleTriggerProps
/**
 * Interface representing the properties for the PickerToggleTrigger component.
 * Extends AnimationEventProps and OverlayTriggerProps with specific pick/omit logic.
 */
 extends Omit<AnimationEventProps, 'onEntering' | 'onExiting'>, Pick<OverlayTriggerProps, 'onClose' | 'onOpen' | 'speaker'> {
    /** Appearance style for the component, default or subtle */
    appearance?: 'default' | 'subtle';
    /** Element type to render as */
    as?: React.ElementType;
    /** If true, the component will occupy the full width of its container */
    block?: boolean;
    /** The child element to be rendered */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom class prefix */
    classPrefix?: string;
    /** Disable the component */
    disabled?: boolean;
    /** Unique identifier */
    id?: string;
    /** If true, multiple selection is allowed */
    multiple?: boolean;
    /** Name attribute for the component */
    name?: string;
    /** Controls the open state of the picker */
    open?: boolean;
    /** Picker type identifier for data-picker attribute */
    pickerType?: string;
    /** Additional properties for the picker */
    triggerProps: any;
    /** Placement of the component */
    placement?: Placement;
    /**
     * Identifies the combobox as having a popout, and indicates the type.
     *
     * @see MDN https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-haspopup
     */
    popupType?: 'listbox' | 'tree' | 'grid' | 'dialog' | 'menu';
    /** Reference to the root element */
    rootRef?: React.Ref<any>;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Trigger type for the overlay */
    trigger?: OverlayTriggerType | OverlayTriggerType[];
    /** Size of the component */
    size?: Size;
    /** Whether the component should be responsive */
    responsive?: boolean;
    /** Handler for keydown events */
    onKeyDown?: (event: React.KeyboardEvent) => void;
    /** Handler for click events */
    onClick?: (event: React.MouseEvent) => void;
}
export declare const overlayPropKeys: string[];
export declare const pickerCommonPropKeys: string[];
export declare const triggerPropKeys: string[];
export interface ComboboxContextProps {
    id?: string;
    multiple?: boolean;
    hasLabel?: boolean;
    placement?: Placement;
    breakpoint?: string;
    popupType?: 'listbox' | 'tree' | 'grid' | 'dialog' | 'menu';
}
export declare const ComboboxContext: React.Context<ComboboxContextProps>;
export declare const PickerToggleTrigger: React.ForwardRefExoticComponent<PickerToggleTriggerProps & React.RefAttributes<any>>;
export default PickerToggleTrigger;
