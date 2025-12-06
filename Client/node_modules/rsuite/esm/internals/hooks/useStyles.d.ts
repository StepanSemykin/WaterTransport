import type { ResponsiveValue } from '../types';
export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;
export type ClassArray = Array<ClassValue>;
export interface ClassDictionary {
    [id: string]: any;
}
interface ClassNameUtils {
    withPrefix: (...classes: ClassValue[]) => string;
    merge: (...classes: ClassValue[]) => string;
    prefix: (...classes: ClassValue[]) => string;
    responsive: <T = string>(value?: T | ResponsiveValue<T>) => string[];
    rootPrefix: (...classes: ClassValue[]) => string;
    cssVar: (prop: string, value?: string | number | (string | number)[], valueTransformer?: (value: any) => any) => {
        [x: string]: string | number | undefined;
    } | undefined;
}
/**
 * Add a prefix to all classNames.
 *
 * @param str prefix of className
 * @returns { withPrefix, merge, prefix }
 *  - withPrefix: A function of combining className and adding a prefix to each className.
 *    At the same time, the default `classPrefix` is the first className.
 *  - merge: A merge className function.
 *  - prefix: Add a prefix to className
 *  - rootPrefix
 */
export declare function useStyles(str: string): ClassNameUtils;
export default useStyles;
