'use client';
import { useEffect, useRef } from 'react';
export const useMount = callback => {
  const mountRef = useRef(callback);
  mountRef.current = callback;
  useEffect(() => {
    var _mountRef$current;
    (_mountRef$current = mountRef.current) === null || _mountRef$current === void 0 || _mountRef$current.call(mountRef);
  }, []);
};
export default useMount;