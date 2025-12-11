import { BoxProps } from '../internals/Box';
import { TextSize } from '../internals/types';
export interface TextProps extends BoxProps {
    /**
     * The font color of the text.
     * Accepts preset colors or CSS color values
     */
    color?: BoxProps['c'];
    /**
     * The font size of the text.
     */
    size?: TextSize | number | string;
    /**
     * To set the text to be muted.
     */
    muted?: boolean;
    /**
     * To set the text transformation of the element.
     */
    transform?: 'uppercase' | 'lowercase' | 'capitalize';
    /**
     * To set the text alignment of the element
     */
    align?: 'left' | 'center' | 'right' | 'justify';
    /**
     * The font weight of the text.
     * @default 'regular'
     */
    weight?: 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    /**
     * The number of lines to limit the provided text to. Text will be truncated with an ellipsis.
     */
    maxLines?: number;
}
/**
 *
 * The `Text` component is used to display text.
 *
 * @see https://rsuitejs.com/components/text
 */
declare const Text: import("../internals/types").InternalRefForwardingComponent<"p", TextProps, never> & Record<string, never>;
export default Text;
