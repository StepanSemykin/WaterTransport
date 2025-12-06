import React from 'react';
export interface OverlayContextProps {
    overlayContainer?: () => HTMLElement | null;
}
interface OverlayProviderProps extends OverlayContextProps {
    children: React.ReactNode;
}
export declare const OverlayProvider: {
    (props: OverlayProviderProps): React.JSX.Element;
    displayName: string;
};
export declare const useOverlay: () => OverlayContextProps;
export {};
