import React from 'react';
import { BoxProps } from '../internals/Box';
export interface FormControlLabelProps extends BoxProps, Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'color'> {
    /** Attribute of the html label tag, defaults to the controlId of the FormGroup */
    htmlFor?: string;
}
/**
 * The `<Form.ControlLabel>` component renders a label with required indicator, for form controls.
 * @see https://rsuitejs.com/components/form/
 */
declare const FormControlLabel: import("../internals/types").InternalRefForwardingComponent<"label", FormControlLabelProps, never> & Record<string, never>;
export default FormControlLabel;
