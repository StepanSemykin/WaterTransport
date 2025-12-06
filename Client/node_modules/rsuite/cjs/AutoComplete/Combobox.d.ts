import { InputProps } from '../Input';
interface ComboboxProps extends InputProps {
    expanded?: boolean;
    focusItemValue?: string | null;
}
declare const Combobox: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"input", InputProps, never> & Record<string, never>, ComboboxProps, never> & Record<string, never>;
export default Combobox;
