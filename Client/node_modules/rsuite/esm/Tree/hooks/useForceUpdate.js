'use client';
import { useState, useCallback } from 'react';
function useForceUpdate() {
  const [, dispatch] = useState(Object.create(null));
  const forceUpdate = useCallback(() => {
    dispatch(Object.create(null));
  }, [dispatch]);
  return forceUpdate;
}
export default useForceUpdate;