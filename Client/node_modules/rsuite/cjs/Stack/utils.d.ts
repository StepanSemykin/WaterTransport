import { CSSProperties } from 'react';
/**
 * Generate CSS variables for Stack component
 */
export declare function generateStackCssVars({ spacing, align, justify }: {
    spacing?: number | string | (number | string)[];
    align?: CSSProperties['alignItems'];
    justify?: CSSProperties['justifyContent'];
}): Record<string, string | number | undefined>;
