import { InputProps } from '../Input';
import type { PropsWithoutChange } from '../internals/types';
import type { TextMaskProps } from './TextMask';
export type MaskedInputProps = PropsWithoutChange<TextMaskProps> & Omit<InputProps, 'type'>;
declare const MaskedInput: import("../internals/types").InternalRefForwardingComponent<"input", MaskedInputProps, never> & Record<string, never>;
export default MaskedInput;
