import { BoxProps } from '../internals/Box';
import type { ErrorMessagePlacement } from '../internals/types';
export interface FormErrorMessageProps extends BoxProps {
    /** Show error messages */
    show?: boolean;
    /** The placement of error messages */
    placement?: ErrorMessagePlacement;
}
/**
 * The `<Form.ErrorMessage>` component is used to display error messages in the form.
 * @see https://rsuitejs.com/components/form/
 */
declare const FormErrorMessage: import("../internals/types").InternalRefForwardingComponent<"div", FormErrorMessageProps, never> & Record<string, never>;
export default FormErrorMessage;
