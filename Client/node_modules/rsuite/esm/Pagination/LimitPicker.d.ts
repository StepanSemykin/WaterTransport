import { type SelectPickerProps } from '../SelectPicker';
import { PaginationLocale } from '../locales';
import type { OnChangeCallback, BasicSize } from '../internals/types';
interface LimitPickerProps extends Omit<SelectPickerProps<any>, 'locale' | 'disabled' | 'data'> {
    disabled?: boolean | ((eventKey: number | string) => boolean);
    limitOptions: number[];
    locale: PaginationLocale;
    limit: number;
    size?: BasicSize;
    prefix: (input: string) => string;
    onChangeLimit: OnChangeCallback<any>;
}
declare const LimitPicker: import("../internals/types").InternalRefForwardingComponent<"div", LimitPickerProps, never> & Record<string, never>;
export default LimitPicker;
