'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { forwardRef, useState, useImperativeHandle, useCallback } from 'react';
import kebabCase from 'lodash/kebabCase';
import Transition from "../Animation/Transition.js";
import ToastContext from "./ToastContext.js";
import canUseDOM from 'dom-lib/canUseDOM';
import { useStyles } from "../internals/hooks/index.js";
import { guid, createChainedFunction } from "../internals/utils/index.js";
import { render } from "./render.js";
export const defaultToasterContainer = () => {
  return canUseDOM ? document.body : null;
};
export const toastPlacements = ['topCenter', 'bottomCenter', 'topStart', 'topEnd', 'bottomStart', 'bottomEnd'];
const useMessages = () => {
  const [messages, setMessages] = useState([]);
  const getKey = useCallback(key => {
    if (typeof key === 'undefined' && messages.length) {
      return messages[messages.length - 1].key;
    }
    return key;
  }, [messages]);
  const push = useCallback((message, options) => {
    const {
      duration,
      mouseReset = true,
      container
    } = options || {};
    const key = guid();
    setMessages(prevMessages => [...prevMessages, {
      key,
      visible: true,
      node: message,
      duration,
      mouseReset,
      container
    }]);
    return key;
  }, []);
  const clear = useCallback(() => {
    // Set all existing messages to be invisible.
    setMessages(messages.map(msg => ({
      ...msg,
      visible: false
    })));

    // Remove all invisible messages after 400ms.
    // The delay removal here is to preserve the animation.
    setTimeout(() => {
      setMessages(() => []);
    }, 400);
  }, [messages]);
  const remove = useCallback(key => {
    // Set the message of the specified key to invisible.
    setMessages(messages.map(n => {
      if (n.key === getKey(key)) {
        n.visible = false;
      }
      return n;
    }));

    // Remove invisible messages after 400ms.
    setTimeout(() => {
      setMessages(prevMessages => prevMessages.filter(msg => msg.visible));
    }, 400);
  }, [messages, getKey]);
  return {
    messages,
    push,
    clear,
    remove
  };
};
const ToastContainer = /*#__PURE__*/forwardRef(function ToastContainer(props, ref) {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'toast-container',
    placement = 'topCenter',
    ...rest
  } = props;
  const {
    withPrefix,
    merge,
    rootPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(kebabCase(placement)));
  const {
    push,
    clear,
    remove,
    messages
  } = useMessages();
  useImperativeHandle(ref, () => ({
    push,
    clear,
    remove
  }));
  const elements = messages.map(item => {
    const {
      mouseReset,
      duration,
      node
    } = item;
    return /*#__PURE__*/React.createElement(ToastContext.Provider, {
      value: {
        usedToaster: true,
        mouseReset,
        duration
      },
      key: item.key
    }, /*#__PURE__*/React.createElement(Transition, {
      in: item.visible,
      exitedClassName: rootPrefix('toast-fade-exited'),
      exitingClassName: rootPrefix('toast-fade-exiting'),
      enteringClassName: rootPrefix('toast-fade-entering'),
      enteredClassName: rootPrefix('toast-fade-entered'),
      timeout: 300
    }, (transitionProps, ref) => {
      var _node$props, _node$props2;
      const {
        className: transitionClassName,
        ...rest
      } = transitionProps;
      return /*#__PURE__*/React.cloneElement(node, {
        ...rest,
        ref,
        duration,
        onClose: createChainedFunction((_node$props = node.props) === null || _node$props === void 0 ? void 0 : _node$props.onClose, () => remove(item.key)),
        className: merge(rootPrefix('toast'), (_node$props2 = node.props) === null || _node$props2 === void 0 ? void 0 : _node$props2.className, transitionClassName)
      });
    }));
  });
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    className: classes
  }), elements);
});
ToastContainer.getInstance = async props => {
  const {
    container,
    ...toastProps
  } = props;

  // Promise to wait for containerRef to be assigned
  let resolveContainerRef = null;
  const containerRefReady = new Promise(resolve => {
    resolveContainerRef = resolve;
  });

  // Create a React ref for the ToastContainer instance
  const toastContainerRef = /*#__PURE__*/React.createRef();

  // Render the ToastContainer component into the specified container
  const containerId = render(/*#__PURE__*/React.createElement(ToastContainer, _extends({}, toastProps, {
    ref: ref => {
      var _resolveContainerRef;
      toastContainerRef.current = ref;
      (_resolveContainerRef = resolveContainerRef) === null || _resolveContainerRef === void 0 || _resolveContainerRef();
    }
  })), container);
  await containerRefReady;
  return [toastContainerRef, containerId];
};
ToastContainer.displayName = 'ToastContainer';
export default ToastContainer;