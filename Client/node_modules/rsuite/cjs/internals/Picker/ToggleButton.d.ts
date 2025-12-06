import React from 'react';
import { ButtonProps } from '../../Button';
export type ToggleButtonProps = Omit<ButtonProps, 'color'>;
declare const ToggleButton: React.ForwardRefExoticComponent<ToggleButtonProps & React.RefAttributes<HTMLDivElement>>;
export default ToggleButton;
