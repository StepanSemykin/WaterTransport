'use client';
import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { guid } from "../internals/utils/index.js";
const DialogContainer = /*#__PURE__*/forwardRef((_, ref) => {
  const [dialogs, setDialogs] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const dialogsRef = useRef([]);

  // Only render on the client side to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useImperativeHandle(ref, () => ({
    renderDialog: dialog => {
      // Always generate a unique key using guid
      const dialogKey = guid();
      const nextDialogs = [...dialogsRef.current, {
        key: dialogKey,
        dialog
      }];
      dialogsRef.current = nextDialogs;
      setDialogs(nextDialogs);
      return dialogKey;
    },
    removeDialog: key => {
      // Find if the dialog exists
      const dialogExists = dialogsRef.current.some(item => item.key === key);
      if (dialogExists) {
        // Filter out the dialog with the matching key
        const nextDialogs = dialogsRef.current.filter(item => item.key !== key);

        // Update both the ref and state
        dialogsRef.current = nextDialogs;
        setDialogs(nextDialogs);
      }
    },
    clearDialogs: () => {
      dialogsRef.current = [];
      setDialogs([]);
    }
  }));

  // Only render Portal on the client side to avoid hydration issues
  if (!isMounted) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, dialogs.map(item => /*#__PURE__*/React.createElement(React.Fragment, {
    key: item.key
  }, item.dialog)));
});
DialogContainer.displayName = 'DialogContainer';
export default DialogContainer;