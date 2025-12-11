'use client';
/**
 * Check if the time should be rendered based on the format.
 *
 * @param format - The format string.
 * @returns Whether the time should be rendered.
 */
export const shouldRenderTime = format => /([Hhms])/.test(format);

/**
 * Check if the month should be rendered based on the format.
 *
 * @param format - The format string.
 * @returns Whether the month should be rendered.
 */
export const shouldRenderMonth = format => /[Yy]/.test(format) && /[ML]/.test(format);

/**
 * Check if the date should be rendered based on the format.
 *
 * @param format - The format string.
 * @returns Whether the date should be rendered.
 */
export const shouldRenderDate = format => /[Yy]/.test(format) && /[ML]/.test(format) && /[Dd]/.test(format);

/**
 * Check if only the time should be rendered based on the format.
 *
 * @param format - The format string.
 * @returns Whether only the time should be rendered.
 */
export const shouldOnlyRenderTime = format => /([Hhms])/.test(format) && !/([YyMDd])/.test(format);

/**
 * Check if only the month should be rendered based on the format.
 */
export const shouldOnlyRenderMonth = format => shouldRenderMonth(format) && !shouldRenderDate(format);