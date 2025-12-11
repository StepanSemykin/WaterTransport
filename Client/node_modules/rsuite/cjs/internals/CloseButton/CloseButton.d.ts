import { CloseButtonLocale } from '../../locales';
import type { WithAsProps } from '../types';
export interface CloseButtonProps extends WithAsProps {
    /** Custom locale */
    locale?: CloseButtonLocale;
}
/**
 * Close button for components such as Message and Notification.
 */
declare const CloseButton: import("../types").InternalRefForwardingComponent<"button", CloseButtonProps, never> & Record<string, never>;
export default CloseButton;
