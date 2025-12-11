'use client';
import omitBy from 'lodash/omitBy';
/**
 * Omit the calendar-only props from an object.
 *
 * @param props - The object to omit props from.
 * @returns The object with calendar-only props omitted.
 */
export const omitHideDisabledProps = props => omitBy(props, (_val, key) => key.startsWith('disabled') || key.startsWith('hide') || key.startsWith('shouldDisable'));
export default omitHideDisabledProps;