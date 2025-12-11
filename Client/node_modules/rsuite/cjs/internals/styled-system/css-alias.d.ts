import type { CSSSystemProps, CSSProperty } from './types';
/**
 * CSS Property Alias
 * This type maps all the CSS properties defined in cssSystemPropAlias to their corresponding React CSS types
 */
export declare const cssSystemPropAlias: Partial<Record<keyof CSSSystemProps, CSSProperty>>;
export type CSSSystemPropKey = keyof typeof cssSystemPropAlias;
