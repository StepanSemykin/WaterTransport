/// <reference types="react" />
import type { OverlayTriggerHandle } from '../../Overlay';
import type { ListHandle } from '../../Windowing';
/**
 * A hook of the exposed method of Picker
 */
declare function usePickerRef(ref: any): {
    trigger: import("react").RefObject<OverlayTriggerHandle | null>;
    root: import("react").RefObject<any>;
    overlay: import("react").RefObject<HTMLElement | null>;
    target: import("react").RefObject<HTMLElement | null>;
    list: import("react").RefObject<ListHandle | null>;
    searchInput: import("react").RefObject<HTMLInputElement | null>;
    treeView: import("react").RefObject<HTMLDivElement | null>;
};
export default usePickerRef;
