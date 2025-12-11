import React from 'react';
import { BaseModalProps } from '../internals/Overlay/Modal';
import { ModalSize } from './utils';
export interface ModalProps extends BaseModalProps, Pick<React.HTMLAttributes<HTMLElement>, 'role' | 'id' | 'aria-labelledby' | 'aria-describedby'> {
    /** A modal can have different sizes */
    size?: ModalSize;
    /** Set the duration of the animation */
    animationTimeout?: number;
    /** Set an animation effect for Modal, the default is Bounce.  */
    animation?: React.ElementType;
    /** Set the centered position of the modal */
    centered?: boolean;
    /** CSS class applied to Dialog DOM nodes */
    dialogClassName?: string;
    /** CSS style applied to dialog DOM nodes */
    dialogStyle?: React.CSSProperties;
    /**
     * Full screen
     * @deprecated Use size="full" instead.
     */
    full?: boolean;
    /** You can use a custom element type for Dialog */
    dialogAs?: React.ElementType;
    /** Automatically sets the height when the body content is too long. */
    overflow?: boolean;
    /** Indicates if the component should be displayed as a drawer */
    isDrawer?: boolean;
    /** Custom close button, used when rendered as a Drawer */
    closeButton?: React.ReactNode | boolean;
    /**
     * Remove default padding from the dialog and body so the content can occupy the full height.
     * Useful for creating custom layouts with full-width/height content like split panels or image galleries.
     */
    bodyFill?: boolean;
}
/**
 * The `Modal` component is used to show content in a layer above the app.
 * @see https://rsuitejs.com/components/modal
 */
declare const Modal: import("../internals/types").InternalRefForwardingComponent<"div", ModalProps, never> & {
    Body: import("../internals/types").InternalRefForwardingComponent<"div", import("..").BoxProps, never> & Record<string, never>;
    Header: import("../internals/types").InternalRefForwardingComponent<"div", import("./ModalHeader").ModalHeaderProps, never> & Record<string, never>;
    Title: import("../internals/types").InternalRefForwardingComponent<"h4", import("../internals/utils").ComponentProps, never> & Record<string, never>;
    Footer: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Dialog: import("../internals/types").InternalRefForwardingComponent<"div", import("./ModalDialog").ModalDialogProps, never> & Record<string, never>;
};
export default Modal;
