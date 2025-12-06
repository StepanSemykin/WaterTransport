import { BoxProps } from '../internals/Box';
export interface FormGroupProps extends BoxProps {
    /**
     * Sets id on `<Form.Control>` and `htmlFor` on `<Form.ControlLabel>`.
     * And generate ʻaria-labelledby` and ʻaria-describedby` for `<Form.Control>`.
     */
    controlId?: string;
}
/**
 * The `<Form.Group>` component is the easiest way to add some structure to forms.
 * @see https://rsuitejs.com/components/form/
 */
declare const FormGroup: import("../internals/types").InternalRefForwardingComponent<"div", FormGroupProps, never> & Record<string, never>;
export default FormGroup;
