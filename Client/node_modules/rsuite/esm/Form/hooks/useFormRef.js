'use client';
import { useRef, useImperativeHandle } from 'react';
export default function useFormRef(ref, props) {
  const rootRef = useRef(null);
  const {
    imperativeMethods
  } = props;
  useImperativeHandle(ref, () => {
    return {
      root: rootRef.current,
      ...imperativeMethods
    };
  });
  return rootRef;
}