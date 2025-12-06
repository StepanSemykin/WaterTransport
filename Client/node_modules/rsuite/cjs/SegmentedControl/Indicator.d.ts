import React from 'react';
export interface IndicatorProps {
    style: React.CSSProperties;
    classPrefix: string;
}
declare const Indicator: {
    ({ style, classPrefix }: IndicatorProps): React.JSX.Element;
    displayName: string;
};
export default Indicator;
