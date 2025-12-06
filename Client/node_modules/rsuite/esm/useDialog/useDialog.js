'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext, useEffect } from 'react';
import canUseDOM from 'dom-lib/canUseDOM';
import Dialog from "./Dialog.js";
import { CustomContext } from "../internals/Provider/CustomContext.js";
/**
 * Options for creating a dialog
 */
const WAIT_FOR_CONTAINER_TIMEOUT = 2000;
const useDialogContainer = () => {
  const context = useContext(CustomContext);
  useEffect(() => {
    if (canUseDOM && !(context !== null && context !== void 0 && context.dialogContainer)) {
      console.warn('Warning: useDialog is being used outside of a CustomProvider. ' + 'Please wrap your application with <CustomProvider> to ensure proper functionality.');
    }
  }, [context === null || context === void 0 ? void 0 : context.dialogContainer]);

  // Return the ref from context directly instead of copying to a local ref
  // This ensures we always use the latest mounted DialogContainer instance
  return (context === null || context === void 0 ? void 0 : context.dialogContainer) || {
    current: null
  };
};

/**
 * A hook that provides methods to show dialogs.
 * @see https://rsuitejs.com/components/use-dialog
 */
export function useDialog() {
  const dialogContainerRef = useDialogContainer();
  const waitForContainer = useCallback(async () => {
    if (!canUseDOM) {
      return null;
    }
    if (dialogContainerRef.current) {
      return dialogContainerRef.current;
    }
    const timeoutAt = Date.now() + WAIT_FOR_CONTAINER_TIMEOUT;
    return new Promise(resolve => {
      const checkContainerReady = () => {
        if (dialogContainerRef.current) {
          resolve(dialogContainerRef.current);
          return;
        }
        if (Date.now() > timeoutAt) {
          resolve(null);
          return;
        }
        requestAnimationFrame(checkContainerReady);
      };
      checkContainerReady();
    });
  }, [dialogContainerRef]);
  const createDialog = useCallback((content, options) => {
    const {
      type,
      title,
      okText,
      cancelText,
      severity,
      defaultValue,
      validate
    } = options;
    return new Promise(resolve => {
      waitForContainer().then(container => {
        if (!canUseDOM || !container) {
          resolve(undefined);
          return;
        }
        let isDialogClosed = false;
        let dialogKey = null;
        const handleClose = result => {
          if (isDialogClosed) {
            return;
          }
          isDialogClosed = true;
          if (dialogKey !== null) {
            container.removeDialog(dialogKey);
          }
          resolve(result);
        };
        let dialogComponent;
        if (type === 'custom' && options.as) {
          const {
            as: Component,
            props
          } = options;
          dialogComponent = /*#__PURE__*/React.createElement(Component, _extends({
            onClose: handleClose
          }, props));
        } else {
          dialogComponent = /*#__PURE__*/React.createElement(Dialog, {
            type: type,
            title: title,
            content: content,
            okText: okText,
            cancelText: cancelText,
            onClose: handleClose,
            defaultValue: defaultValue || '',
            severity: severity,
            validate: validate
          });
        }
        dialogKey = container.renderDialog(dialogComponent);
      });
    });
  }, [waitForContainer]);
  const alert = useCallback((message, options) => {
    return createDialog(message, {
      ...options,
      type: 'alert'
    });
  }, [createDialog]);
  const confirm = useCallback((message, options) => {
    return createDialog(message, {
      ...options,
      type: 'confirm'
    });
  }, [createDialog]);
  const prompt = useCallback((message, options = {}) => {
    return createDialog(message, {
      ...options,
      type: 'prompt'
    });
  }, [createDialog]);
  const open = useCallback((as, payload, options) => {
    return createDialog(null, {
      ...options,
      as,
      type: 'custom',
      props: {
        payload
      }
    });
  }, [createDialog]);
  return {
    alert,
    confirm,
    prompt,
    open
  };
}
export default useDialog;