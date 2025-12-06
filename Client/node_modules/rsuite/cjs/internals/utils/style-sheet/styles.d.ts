import { Size } from '../../types';
import { Color } from '../../types/colours';
type StyleValue<T = Color | Size | number | string> = T;
type PresetChecker<T = StyleValue> = (value: T) => boolean;
type ValueTransformer<T = StyleValue> = (value: T) => string | undefined;
interface StylePropConfig<T = StyleValue> {
    prop: string;
    useGlobalVar?: boolean;
    presetChecker?: PresetChecker<T>;
    valueTransformer?: ValueTransformer<T>;
}
export declare const createStyleValueSetter: <T = string | number>(config: StylePropConfig<T>) => (value?: T | undefined, name?: string, prop?: string) => string | T | undefined;
export declare const createStyleGetter: <T = string | number>(config: StylePropConfig<T>) => (value?: T | undefined, name?: string, prop?: string) => {
    [x: string]: string | T | undefined;
} | undefined;
export {};
