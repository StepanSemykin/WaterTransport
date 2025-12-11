'use client';
import { useState, useRef, useCallback } from 'react';
import isNil from 'lodash/isNil';
import { TREE_NODE_DROP_POSITION } from "../../internals/constants/index.js";
import { useEventCallback } from "../../internals/hooks/index.js";
import { shallowEqual as equal, stringifyReactNode } from "../../internals/utils/index.js";
import { useItemDataKeys } from "../../internals/Tree/TreeProvider.js";
/**
 * The gap between tree nodes.
 */
const TREE_NODE_GAP = 4;

/**
 * Calculates the drop position of a tree node based on the clientY coordinate of a drag event
 * and the bounding rectangle of the tree node element.
 *
 * @param event - The drag event.
 * @param treeNodeElement - The element representing the tree node.
 * @returns The drop position of the tree node.
 */
function calDropNodePosition(event, treeNodeElement) {
  const {
    clientY
  } = event;
  const {
    top,
    bottom
  } = treeNodeElement.getBoundingClientRect();
  const gap = TREE_NODE_GAP;

  // bottom of node
  if (clientY >= bottom - gap && clientY <= bottom) {
    return TREE_NODE_DROP_POSITION.DRAG_OVER_BOTTOM;
  }

  // top of node
  if (clientY <= top + gap && clientY >= top) {
    return TREE_NODE_DROP_POSITION.DRAG_OVER_TOP;
  }
  if (clientY >= top + gap && clientY <= bottom - gap) {
    return TREE_NODE_DROP_POSITION.DRAG_OVER;
  }
  return -1;
}

/**
 * Creates a drag preview element for tree nodes.
 */
function createDragPreview(name, className) {
  const dragPreview = document.createElement('div');
  dragPreview.id = 'rs-tree-drag-preview';
  dragPreview.dataset.testid = 'drag-preview';
  dragPreview.innerHTML = name;
  dragPreview.classList.add(className);
  document.body.appendChild(dragPreview);
  return dragPreview;
}

/**
 * Removes the drag preview element from the DOM.
 */
function removeDragPreview() {
  var _dragPreview$parentNo, _dragPreview$parentNo2;
  const dragPreview = document.getElementById('rs-tree-drag-preview');
  dragPreview === null || dragPreview === void 0 || (_dragPreview$parentNo = dragPreview.parentNode) === null || _dragPreview$parentNo === void 0 || (_dragPreview$parentNo2 = _dragPreview$parentNo.removeChild) === null || _dragPreview$parentNo2 === void 0 || _dragPreview$parentNo2.call(_dragPreview$parentNo, dragPreview);
}
/**
 * Custom hook for handling tree node dragging.
 */
export default function useTreeDrag(props) {
  const {
    childrenKey,
    valueKey,
    labelKey
  } = useItemDataKeys();
  const {
    draggable,
    flattenedNodes,
    treeNodesRefs,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrop,
    prefix
  } = props;
  // current dragging node
  const dragNode = useRef(null);
  const [dragOverNodeKey, setDragOverNodeKey] = useState(null);
  // drag node and it's children nodes key
  const [dragNodeKeys, setDragNodeKeys] = useState([]);
  const [dropNodePosition, setDropNodePosition] = useState(null);
  const setDragNode = useCallback(node => {
    dragNode.current = node;
  }, []);

  /**
   * Retrieves an array of keys for the nodes in a tree starting from the specified drag node.
   */
  const getDragNodeKeys = useCallback(dragNode => {
    let dragNodeKeys = [dragNode[valueKey]];
    const traverse = data => {
      if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
        data.forEach(node => {
          dragNodeKeys = dragNodeKeys.concat([node[valueKey]]);
          if (node[childrenKey]) {
            traverse(node[childrenKey]);
          }
        });
      }
    };
    traverse(dragNode[childrenKey]);
    return dragNodeKeys;
  }, [childrenKey, valueKey]);

  /**
   * Removes the drag node from the data array.
   *
   */
  const removeDragNode = useCallback((data, params) => {
    const {
      dragNode
    } = params;
    const traverse = (items, parent) => {
      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (equal(item[valueKey], dragNode[valueKey])) {
          items.splice(index, 1);
          // when children is empty, delete children prop for hidden anchor
          if (items.length === 0 && parent) {
            delete parent.children;
          }
          break;
        }
        if (Array.isArray(item[childrenKey])) {
          traverse(item[childrenKey], item);
        }
      }
    };
    traverse(data);
  }, [childrenKey, valueKey]);

  /**
   * Creates a function that modifies a tree data structure based on drag and drop parameters.
   */
  const createDragTreeDataFunction = useCallback(params => {
    return function (tree) {
      const data = [...tree];
      const {
        dragNode,
        dropNode,
        dropNodePosition
      } = params;
      const cloneDragNode = {
        ...dragNode
      };
      removeDragNode(data, params);
      const updateTree = items => {
        for (let index = 0; index < items.length; index += 1) {
          const item = items[index];
          if (equal(item[valueKey], dropNode[valueKey])) {
            // drag to node inside
            if (dropNodePosition === TREE_NODE_DROP_POSITION.DRAG_OVER) {
              item[childrenKey] = isNil(item[childrenKey]) ? [] : item[childrenKey];
              item[childrenKey].push(cloneDragNode);
              break;
            } else if (dropNodePosition === TREE_NODE_DROP_POSITION.DRAG_OVER_TOP) {
              // drag to top of node
              items.splice(index, 0, cloneDragNode);
              break;
            } else if (dropNodePosition === TREE_NODE_DROP_POSITION.DRAG_OVER_BOTTOM) {
              // drag to bottom of node
              items.splice(index + 1, 0, cloneDragNode);
              break;
            }
          }
          if (Array.isArray(item[childrenKey]) && item[childrenKey].length > 0) {
            updateTree(item[childrenKey]);
          }
        }
      };
      updateTree(data);
      return [...data];
    };
  }, [childrenKey, removeDragNode, valueKey]);
  const getDropData = useCallback(nodeData => {
    const dragParams = {
      dragNode: dragNode.current,
      dropNode: nodeData,
      dropNodePosition
    };
    return {
      ...dragParams,
      createUpdateDataFunction: createDragTreeDataFunction(dragParams)
    };
  }, [createDragTreeDataFunction, dropNodePosition]);
  const handleDragStart = useEventCallback((nodeData, event) => {
    if (draggable) {
      var _event$dataTransfer;
      const dragMoverNode = createDragPreview(stringifyReactNode(nodeData[labelKey]), prefix('drag-preview'));
      (_event$dataTransfer = event.dataTransfer) === null || _event$dataTransfer === void 0 || _event$dataTransfer.setDragImage(dragMoverNode, 0, 0);
      setDragNodeKeys(getDragNodeKeys(nodeData));
      setDragNode(flattenedNodes[nodeData.refKey]);
      onDragStart === null || onDragStart === void 0 || onDragStart(nodeData, event);
    }
  });
  const handleDragEnter = useEventCallback((nodeData, event) => {
    if (dragNodeKeys.some(d => equal(d, nodeData[valueKey]))) {
      return;
    }
    if (dragNode.current) {
      setDragOverNodeKey(nodeData[valueKey]);
      setDropNodePosition(calDropNodePosition(event, treeNodesRefs[nodeData.refKey]));
    }
    onDragEnter === null || onDragEnter === void 0 || onDragEnter(nodeData, event);
  });
  const handleDragOver = useEventCallback((nodeData, event) => {
    if (dragNodeKeys.some(d => equal(d, nodeData[valueKey]))) {
      event.dataTransfer.dropEffect = 'none';
      return;
    }
    if (dragNode.current && equal(nodeData[valueKey], dragOverNodeKey)) {
      const lastDropNodePosition = calDropNodePosition(event, treeNodesRefs[nodeData.refKey]);
      if (lastDropNodePosition === dropNodePosition) return;
      setDropNodePosition(lastDropNodePosition);
    }
    onDragOver === null || onDragOver === void 0 || onDragOver(nodeData, event);
  });
  const handleDragLeave = useEventCallback((nodeData, event) => {
    onDragLeave === null || onDragLeave === void 0 || onDragLeave(nodeData, event);
  });
  const handleDragEnd = useEventCallback((nodeData, event) => {
    removeDragPreview();
    setDragNode(null);
    setDragNodeKeys([]);
    setDragOverNodeKey(null);
    onDragEnd === null || onDragEnd === void 0 || onDragEnd(nodeData, event);
  });
  const handleDrop = useEventCallback((nodeData, event) => {
    if (dragNodeKeys.some(d => equal(d, nodeData[valueKey]))) {
      console.error('Cannot drag a node to itself and its children');
    } else {
      const dropData = getDropData(nodeData);
      onDrop === null || onDrop === void 0 || onDrop(dropData, event);
    }
    removeDragPreview();
    setDragNode(null);
    setDragNodeKeys([]);
    setDragOverNodeKey(null);
  });
  const dragEvents = {
    onDragStart: handleDragStart,
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
    onDrop: handleDrop
  };
  return {
    dragNode: dragNode === null || dragNode === void 0 ? void 0 : dragNode.current,
    dragOverNodeKey,
    dropNodePosition,
    dragEvents
  };
}