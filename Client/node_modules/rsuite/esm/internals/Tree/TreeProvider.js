'use client';
import { createContext, useContext, useRef, useCallback } from 'react';
const defaultItemDataKeys = {
  labelKey: 'label',
  valueKey: 'value',
  childrenKey: 'children',
  virtualized: false
};
const TreeContext = /*#__PURE__*/createContext({
  props: defaultItemDataKeys
});
export const TreeProvider = TreeContext.Provider;
export const useRegisterTreeMethods = () => {
  const {
    register
  } = useContext(TreeContext);
  return register;
};
export const useTreeCustomRenderer = () => {
  const {
    props: {
      renderTreeIcon,
      renderTreeNode
    }
  } = useContext(TreeContext);
  return {
    renderTreeIcon,
    renderTreeNode
  };
};
export const useItemDataKeys = () => {
  const {
    props: {
      labelKey,
      valueKey,
      childrenKey
    } = defaultItemDataKeys
  } = useContext(TreeContext);
  return {
    labelKey,
    valueKey,
    childrenKey
  };
};
export const useTreeContextProps = () => {
  const {
    props
  } = useContext(TreeContext);
  return props;
};

/**
 * Custom hook that provides imperative handle for the Tree component.
 */
export const useTreeImperativeHandle = () => {
  const focusFirstNodeRef = useRef(null);
  const focusActiveNodeRef = useRef(null);
  const register = useCallback(({
    focusTreeFirstNode,
    focusTreeActiveNode
  }) => {
    focusFirstNodeRef.current = focusTreeFirstNode;
    focusActiveNodeRef.current = focusTreeActiveNode;
    return () => {
      focusFirstNodeRef.current = null;
      focusActiveNodeRef.current = null;
    };
  }, []);
  return {
    register,
    focusFirstNode: () => {
      var _focusFirstNodeRef$cu;
      return (_focusFirstNodeRef$cu = focusFirstNodeRef.current) === null || _focusFirstNodeRef$cu === void 0 ? void 0 : _focusFirstNodeRef$cu.call(focusFirstNodeRef);
    },
    focusActiveNode: () => {
      var _focusActiveNodeRef$c;
      return (_focusActiveNodeRef$c = focusActiveNodeRef.current) === null || _focusActiveNodeRef$c === void 0 ? void 0 : _focusActiveNodeRef$c.call(focusActiveNodeRef);
    }
  };
};