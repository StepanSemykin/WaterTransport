import React from 'react';
import { BoxProps } from '../Box';
import type { AnimationEventProps } from '../types';
export interface BaseModalProps extends Omit<BoxProps, 'children' | 'transition' | 'color' | 'overflow'>, AnimationEventProps {
    /** Animation-related properties */
    animationProps?: any;
    /** Primary content */
    children?: any;
    /**
     * Add an optional extra class name to .modal-backdrop
     * It could end up looking like class="modal-backdrop foo-modal-backdrop in"
     */
    backdropClassName?: string;
    /** CSS style applied to backdrop DOM nodes  */
    backdropStyle?: React.CSSProperties;
    /** Open  modal */
    open?: boolean;
    /**
     * When set to true, the Modal will display the background when it is opened.
     * Clicking on the background will close the Modal. If you do not want to close the Modal,
     * set it to 'static'.
     */
    backdrop?: boolean | 'static';
    /** Close Modal when esc key is pressed */
    keyboard?: boolean;
    /**
     * When set to true, the Modal is opened and is automatically focused on its own,
     * accessible to screen readers
     */
    autoFocus?: boolean;
    /**
     * When set to true, Modal will prevent the focus from leaving when opened,
     * making it easier for the secondary screen reader to access
     */
    enforceFocus?: boolean;
    /** Called when Modal is displayed */
    onOpen?: () => void;
    /** Called when Modal is closed */
    onClose?: (event?: React.SyntheticEvent) => void;
    container?: HTMLElement | (() => HTMLElement);
    containerClassName?: string;
    backdropTransitionTimeout?: number;
    dialogTransitionTimeout?: number;
    transition?: React.ElementType;
    onEsc?: React.KeyboardEventHandler;
    onClick?: React.MouseEventHandler;
    onMouseDown?: React.MouseEventHandler;
    onBackdropClick?: React.MouseEventHandler;
}
declare const Modal: any;
export default Modal;
