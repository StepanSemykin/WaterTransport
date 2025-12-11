import { RefObject } from 'react';
interface UseIndicatorPositionProps {
    containerRef: RefObject<HTMLDivElement | null>;
    activeIndex?: number;
    indicator: 'pill' | 'underline';
    data?: Array<{
        value: string | number;
    }>;
    block?: boolean;
}
/**
 * Custom hook to calculate and update the indicator position
 */
declare const useIndicatorPosition: ({ containerRef, activeIndex, indicator, data }: UseIndicatorPositionProps) => {
    style: import("react").CSSProperties;
};
export default useIndicatorPosition;
