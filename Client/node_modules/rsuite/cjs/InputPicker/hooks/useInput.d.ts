import React from 'react';
import type { OverlayTriggerHandle } from '../../internals/Overlay';
import type { InputSearchProps } from '../InputSearch';
interface InputProps {
    multi?: boolean;
    triggerRef: React.RefObject<OverlayTriggerHandle | null>;
}
declare function useInput(props: InputProps): {
    inputProps: InputSearchProps;
    inputRef: React.RefObject<any>;
    focus: () => void;
    blur: () => void;
};
export default useInput;
