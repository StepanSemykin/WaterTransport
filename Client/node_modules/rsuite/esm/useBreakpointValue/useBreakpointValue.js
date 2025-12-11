'use client';
import useMediaQuery from "../useMediaQuery/index.js";
/**
 * A React Hook that returns different values based on different screen sizes in responsive design.
 * @version 5.64.0
 * @unstable Please note that this API is not stable and may change in the future.
 * @see https://rsuitejs.com/components/use-breakpoint-value
 *
 * @example
 * ```ts
 * const fontSize = useBreakpointValue({ sm: "14px", lg: "24px" }, { defaultValue: "16px" });
 * const direction = useBreakpointValue({ sm: 'row' }, { defaultValue:'column' });
 * ```
 *
 */
export function useBreakpointValue(breakpoints, options) {
  const {
    defaultValue,
    enabled = true
  } = options || {};
  const keys = Object.keys(breakpoints);
  const values = Object.values(breakpoints);
  const matches = useMediaQuery(keys, enabled);

  // Use lastIndexOf instead of indexOf to return the value of the last matching breakpoint
  // Due to how media queries work, multiple breakpoints may match simultaneously on larger screens
  // Using lastIndexOf ensures we return the value for the largest matching breakpoint
  const index = matches.lastIndexOf(true);
  return index !== -1 ? values[index] : defaultValue;
}
export default useBreakpointValue;