import { InputPickerProps } from '../InputPicker/InputPicker';
import { TagOnlyProps } from '../InputPicker/InputPickerContext';
export type TagInputProps = Omit<InputPickerProps<readonly string[]>, 'data'> & Partial<TagOnlyProps>;
/**
 * The `TagInput` component is an enhancement of Input and supports input tags and management tags.
 *
 * @see https://rsuitejs.com/components/tag-input
 */
declare const TagInput: import("../internals/types").InternalRefForwardingComponent<"div", TagInputProps, never> & Record<string, never>;
export default TagInput;
