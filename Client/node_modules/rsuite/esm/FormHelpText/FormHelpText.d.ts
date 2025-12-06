import React from 'react';
import { BoxProps } from '../internals/Box';
export interface FormHelpTextProps extends BoxProps, Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'> {
    /** Whether to show through the Tooltip component */
    tooltip?: boolean;
}
/**
 * The `<Form.HelpText>` component is used to display help information in the form.
 * @see https://rsuitejs.com/components/form/
 */
declare const FormHelpText: import("../internals/types").InternalRefForwardingComponent<"span", FormHelpTextProps, never> & Record<string, never>;
export default FormHelpText;
