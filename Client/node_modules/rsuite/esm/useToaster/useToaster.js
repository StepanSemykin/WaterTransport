'use client';
import { useMemo, useContext, useEffect } from 'react';
import toaster from "../toaster/index.js";
import { CustomContext } from "../internals/Provider/CustomContext.js";
import { canUseDOM } from "../DOMHelper/index.js";

/**
 * Toaster display brief, temporary notifications of actions, errors, or other events in an application.
 * It is often used with the Message and Notification components.
 * @returns toaster { push, remove, clear }
 *
 * @see https://rsuitejs.com/components/use-toaster/
 */
const useToaster = () => {
  const {
    toasters,
    toastContainer
  } = useContext(CustomContext);
  useEffect(() => {
    if (canUseDOM && !toasters) {
      console.warn('Warning: useToaster is being used outside of a CustomProvider. ' + 'Please wrap your application with <CustomProvider> to ensure proper functionality.');
    }
  }, [toasters]);
  return useMemo(() => ({
    /**
     * Push a toast message.
     * @param message The message to be displayed.
     *                eg: `<Message type="success" description="Success" />` or `<Notification type="success" closable>Success</Notification>`
     * @param options The options of the toast message. (optional)
     *                eg: `{ placement: 'topCenter', duration: 5000 }`
     * @returns The key of the toast message.
     */
    push: (message, options) => {
      const container = (typeof (options === null || options === void 0 ? void 0 : options.container) === 'function' ? options === null || options === void 0 ? void 0 : options.container() : options === null || options === void 0 ? void 0 : options.container) || toastContainer;
      if (container === toastContainer) {
        var _toasters$current;
        return toasters === null || toasters === void 0 || (_toasters$current = toasters.current) === null || _toasters$current === void 0 || (_toasters$current = _toasters$current.get((options === null || options === void 0 ? void 0 : options.placement) || 'topCenter')) === null || _toasters$current === void 0 ? void 0 : _toasters$current.push(message, options);
      } else {
        return toaster.push(message, options);
      }
    },
    /**
     * Remove a toast message.
     * @param key  The key of the toast message.
     */
    remove: key => {
      toasters ? Array.from(toasters.current).forEach(([, c]) => c === null || c === void 0 ? void 0 : c.remove(key)) : toaster.remove(key);
    },
    /**
     * Clear all toast messages.
     */
    clear: () => {
      toasters ? Array.from(toasters.current).forEach(([, c]) => c === null || c === void 0 ? void 0 : c.clear()) : toaster.clear();
    }
  }), [toastContainer, toasters]);
};
export default useToaster;