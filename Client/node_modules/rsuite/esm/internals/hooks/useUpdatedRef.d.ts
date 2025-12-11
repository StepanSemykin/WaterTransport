/// <reference types="react" />
/**
 * Returns a ref that is immediately updated with the new value
 *
 * @param value The Ref value
 * @category refs
 */
export declare function useUpdatedRef<T>(value: T): import("react").RefObject<T>;
export default useUpdatedRef;
