import React from 'react';
import { BoxProps } from '../internals/Box';
import type { StatusType } from '../internals/types';
export interface NotificationProps extends Omit<BoxProps, 'children'> {
    children?: React.ReactNode | (() => React.ReactNode);
    /** Title of the message */
    header?: React.ReactNode;
    /**
     * Delay automatic removal of messages.
     * When set to 0, the message is not automatically removed.
     * (Unit: milliseconds)
     *
     * @default 4500
     * @deprecated Use `toaster.push(<Notification />, { duration: 4500 })` instead.
     * @internal
     */
    duration?: number;
    /**
     * The remove button is displayed.
     */
    closable?: boolean;
    /**
     * Type of message
     */
    type?: StatusType;
    /**
     * Callback after the message is removed
     */
    onClose?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}
/**
 * The `Notification` component is used to display global messages and notifications.
 *
 * @see https://rsuitejs.com/components/notification
 */
declare const Notification: any;
export default Notification;
