import type { Query } from './types';
/**
 * React hook that tracks state of a CSS media query
 * @version 5.48.0
 * @unstable Please note that this API is not stable and may change in the future.
 * @see https://rsuitejs.com/components/use-media-query
 * @param query - The media query string or array of query strings
 * @param enabled - Whether to enable the media query, defaults to true
 */
export declare function useMediaQuery(query: Query | Query[], enabled?: boolean): boolean[];
export default useMediaQuery;
