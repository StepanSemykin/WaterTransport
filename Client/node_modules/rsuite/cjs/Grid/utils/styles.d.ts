import type { ResponsiveValue } from '../../internals/types';
import type { GutterType } from '../types';
/**
 * Generates CSS variable styles for grid gutters, supporting both single values and arrays [horizontal, vertical]
 */
export declare const getResponsiveGutterStyles: (gutter?: GutterType | ResponsiveValue<GutterType>) => Record<string, string | undefined>;
