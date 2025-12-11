import React from 'react';
import { BoxProps } from '../Box';
type LocaleKey = 'unfilled' | 'notSelected' | 'notUploaded';
export interface PlaintextProps extends BoxProps {
    placeholder?: React.ReactNode;
    localeKey?: LocaleKey;
}
/**
 * Make the component display in plain text, and display default characters when there is no children.
 * @private
 */
declare const Plaintext: import("../types").InternalRefForwardingComponent<"div", PlaintextProps, never> & Record<string, never>;
export default Plaintext;
