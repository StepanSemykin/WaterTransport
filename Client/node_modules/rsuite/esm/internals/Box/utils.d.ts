/**
 * Extract box properties from props
 * @param props Original props object
 * @returns Object containing only box properties
 */
export declare const extractBoxProps: (props: Record<string, any>) => Record<string, any>;
/**
 * Filter out layout properties from props
 * @param props Original props object
 * @returns New object without layout properties
 */
export declare const omitBoxProps: (props: Record<string, any>) => Record<string, any>;
