import React from 'react';
import { BoxProps } from '../internals/Box';
import type { StarStatus } from './types';
interface CharacterProps extends BoxProps {
    vertical?: boolean;
    status?: StarStatus;
    disabled?: boolean;
    onMouseMove?: (key: 'before' | 'after', event: React.MouseEvent) => void;
    onClick?: (key: 'before' | 'after', event: React.MouseEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}
declare const Character: import("../internals/types").InternalRefForwardingComponent<"li", CharacterProps, never> & Record<string, never>;
export default Character;
