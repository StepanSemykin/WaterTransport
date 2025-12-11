/**
 * Custom hook that manages references to tree nodes. */
export default function useTreeNodeRefs(): {
    treeNodesRefs: {};
    saveTreeNodeRef: (ref: any, refKey?: string) => void;
};
