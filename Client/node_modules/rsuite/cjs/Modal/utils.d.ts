/// <reference types="react" />
import type { Size } from '../internals/types';
export type ModalSize = Size | 'full' | number | string;
export declare const useBodyStyles: (ref: React.RefObject<HTMLElement | null>, options: {
    overflow: boolean;
    size?: ModalSize | undefined;
    prefix: (...classes: any) => string;
}) => [import("react").CSSProperties | null, (entering?: boolean) => void, () => void];
