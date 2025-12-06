import React from 'react';
import type { ProgressSection } from './types';
export interface ProgressSectionsProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The classPrefix passed from parent component */
    classPrefix: string;
    /** Multiple sections with different colors */
    sections: ProgressSection[];
    /** Whether the progress bar is displayed vertically */
    vertical?: boolean;
}
/**
 * A component to render multiple sections in a progress bar
 */
declare const ProgressSections: React.MemoExoticComponent<(props: ProgressSectionsProps) => React.JSX.Element>;
export default ProgressSections;
