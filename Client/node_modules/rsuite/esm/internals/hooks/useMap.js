'use client';
import { useMemo, useState } from 'react';
export function useMap() {
  const [map, setMap] = useState(() => new Map());
  return useMemo(() => {
    return {
      has(key) {
        return map.has(key);
      },
      get(key) {
        return map.get(key);
      },
      set(key, value) {
        setMap(prev => {
          const copy = new Map(prev);
          copy.set(key, value);
          return copy;
        });
      },
      clear() {
        setMap(new Map());
      }
    };
  }, [map]);
}
export default useMap;