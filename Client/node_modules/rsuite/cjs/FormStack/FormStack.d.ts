import { BoxProps } from '../internals/Box';
export interface FormStackProps extends BoxProps {
    /**
     * Set the layout of the elements within the form.
     * 'horizontal': Left and right columns layout.
     * 'vertical': Top and bottom layout.
     * 'inline': Elements are placed inline.
     */
    layout?: 'horizontal' | 'vertical' | 'inline';
    /**
     * The fluid property allows the form elements to fill 100% of the container width.
     * Only valid in vertical layouts.
     */
    fluid?: boolean;
}
/**
 * The `<Form.Stack>` component is a quick layout component through Flexbox,
 * supporting vertical and horizontal stacking, custom spacing and line wrapping.
 * @see https://rsuitejs.com/components/form/
 */
declare const FormStack: import("../internals/types").InternalRefForwardingComponent<"span", FormStackProps, never> & Record<string, never>;
export default FormStack;
