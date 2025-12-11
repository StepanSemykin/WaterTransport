import { CSSProperties } from 'react';
import type { Breakpoints, WithResponsive } from '../types';
interface UseStyledOptions {
    /**
     * CSS variables to apply
     */
    cssVars?: Record<string, WithResponsive<string | number | undefined>>;
    /**
     * Base class name to include
     */
    className?: string;
    /**
     * Base style to merge with
     */
    style?: CSSProperties;
    /**
     * Whether this element should be styled
     * Can be a boolean or a breakpoint string
     */
    enabled?: boolean | Breakpoints;
    /**
     * Prefix for the generated class name
     */
    prefix?: string;
}
/**
 * Result of the useStyled hook
 */
interface UseStyledResult {
    /**
     * Combined class name including the unique identifier
     */
    className: string | undefined;
    /**
     * Style object without CSS variables
     */
    style: CSSProperties | undefined;
    /**
     * Unique identifier for this styled element
     */
    id: string;
}
/**
 * Custom hook for managing component styling with scoped CSS variables
 *
 * This hook handles:
 * 1. Generating a unique class name for the component
 * 2. Creating a scoped style rule to prevent CSS variable inheritance
 * 3. Managing the lifecycle of style rules
 * 4. Handling responsive values for different breakpoints
 *
 * @param options - Styling options
 * @returns Styling properties to apply to the component
 */
export declare function useStyled(options: UseStyledOptions): UseStyledResult;
export default useStyled;
