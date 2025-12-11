import React from 'react';
import { Size } from '../internals/types';
export interface ButtonGroupContextProps {
    size?: Size;
    disabled?: boolean;
}
declare const ButtonGroupContext: React.Context<ButtonGroupContextProps | null>;
export default ButtonGroupContext;
