import React from 'react';
import { BoxProps } from '../internals/Box';
import type { FormControlBaseProps, Size } from '../internals/types';
export interface LocaleType {
    placeholder?: string;
    searchPlaceholder?: string;
    noResultsText?: string;
    loading?: string;
}
export interface SliderProps<T = number> extends BoxProps, FormControlBaseProps<T> {
    /**
     * The label of the slider.
     */
    'aria-label'?: string;
    /**
     * The id of the element containing a label for the slider.
     */
    'aria-labelledby'?: string;
    /**
     * A string value that provides a user-friendly name for the current value of the slider.
     */
    'aria-valuetext'?: string;
    /** Minimum value of sliding range */
    min?: number;
    /** Maximum sliding range */
    max?: number;
    /** Slide the value of one step */
    step?: number;
    /** A css class to apply to the Handle node. */
    handleClassName?: string;
    /** Customizing what is displayed inside a handle */
    handleTitle?: React.ReactNode;
    /** 	A css class to apply to the Bar DOM node */
    barClassName?: string;
    /** custom style */
    handleStyle?: React.CSSProperties;
    /** Show Ticks */
    graduated?: boolean;
    /** Whether to show Tooltip when sliding */
    tooltip?: boolean;
    /** Show sliding progress bar */
    progress?: boolean;
    /** Placeholder text */
    placeholder?: React.ReactNode;
    /** Vertical Slide */
    vertical?: boolean;
    /**
     * If true, tooltip will always be visible  even without hover
     */
    keepTooltipOpen?: boolean;
    /**
     * A slider can have different sizes.
     *
     * @default 'sm'
     * @version 6.0.0
     */
    size?: Size;
    /**
     * Custom marks on the ruler
     * @version 6.0.0
     */
    marks?: {
        value: number;
        label: React.ReactNode;
    }[];
    /** Customize labels on the render ruler */
    renderMark?: (mark: number) => React.ReactNode;
    /** Customize the content of the rendered Tooltip. */
    renderTooltip?: (value: number | undefined) => React.ReactNode;
    /** Accepts a function which returns a string value that provides a user-friendly name for the current value of the slider. */
    getAriaValueText?: (value: number, eventKey?: 'start' | 'end') => string;
    /** Callback function that is fired when the mouseup is triggered. */
    onChangeCommitted?: (value: T, event: React.MouseEvent) => void;
}
/**
 * A Slider is an interface for users to adjust a value in a specific range.
 *
 * @see https://rsuitejs.com/components/slider
 */
declare const Slider: import("../internals/types").InternalRefForwardingComponent<"div", SliderProps<number>, never> & Record<string, never>;
export default Slider;
