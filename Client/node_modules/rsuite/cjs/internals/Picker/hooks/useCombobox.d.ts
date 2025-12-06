declare function useCombobox(): {
    id: string | undefined;
    popupType: "dialog" | "menu" | "listbox" | "grid" | "tree" | undefined;
    multiple: boolean | undefined;
    placement: import("../../types").Placement | undefined;
    breakpoint: string | undefined;
    labelId: string | undefined;
};
export default useCombobox;
