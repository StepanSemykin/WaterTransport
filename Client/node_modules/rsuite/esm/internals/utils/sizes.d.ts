import { SizeEnum } from '../types';
export declare const isPresetSize: (size?: SizeEnum | number | string | null) => boolean;
export declare const getSizeValue: (type: string, size: SizeEnum | number | string | null) => string | undefined;
export declare const getSizeStyle: (value?: string | number | undefined, name?: string | undefined, prop?: string) => {
    [x: string]: string | number | undefined;
} | undefined;
export declare const getLineHeightStyle: (value?: string | number | undefined, name?: string | undefined, prop?: string) => {
    [x: string]: string | number | undefined;
} | undefined;
