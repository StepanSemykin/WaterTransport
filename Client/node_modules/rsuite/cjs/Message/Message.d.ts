import React from 'react';
import { BoxProps } from '../internals/Box';
import type { StatusType } from '../internals/types';
export interface MessageProps extends BoxProps {
    /**
     * The type of the message box.
     */
    type?: StatusType;
    /**
     * Show a border around the message box.
     * @version 5.53.0
     */
    bordered?: boolean;
    /**
     * Center the message vertically.
     * @version 5.53.0
     */
    centered?: boolean;
    /**
     * Whether it is possible to close the message box
     */
    closable?: boolean;
    /**
     * Delay automatic removal of messages.
     * When set to 0, the message is not automatically removed.
     * (Unit: milliseconds)
     *
     * @default 2000
     * @deprecated Use `toaster.push(<Message />, { duration: 2000 })` instead.
     *
     */
    duration?: number;
    /**
     * The title of the message
     */
    header?: React.ReactNode;
    /**
     * Whether to display an icon
     */
    showIcon?: boolean;
    /**
     * Fill the container
     */
    full?: boolean;
    /**
     * Callback after the message is removed
     */
    onClose?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}
/**
 * The `Message` component is used to display important messages to users.
 * @see https://rsuitejs.com/components/message
 */
declare const Message: import("../internals/types").InternalRefForwardingComponent<"div", MessageProps, never> & Record<string, never>;
export default Message;
