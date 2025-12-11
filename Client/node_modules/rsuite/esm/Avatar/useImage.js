'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from "../internals/hooks/index.js";
/**
 * A hook that loads an image and returns the status of the image.
 *
 * @example
 * ```jsx
 * const { loaded } = useImage({ src:'https://example.com/image.jpg' });
 *
 * return loaded ? <img src="https://example.com/image.jpg" /> : <Placeholder />;
 * ```
 */
const useImage = props => {
  const {
    src,
    srcSet,
    sizes,
    crossOrigin,
    onError
  } = props;
  const [status, setStatus] = useState('pending');
  const imgRef = useRef(null);
  const flush = () => {
    if (imgRef.current) {
      imgRef.current.onload = null;
      imgRef.current.onerror = null;
      imgRef.current = null;
    }
  };
  const handleLoad = useCallback(() => {
    setStatus('loaded');
    flush();
  }, []);
  const handleError = useCallback(event => {
    setStatus('error');
    flush();
    onError === null || onError === void 0 || onError(event);
  }, [onError]);
  useEffect(() => {
    setStatus(src ? 'loading' : 'pending');
  }, [src]);
  const loadImge = useCallback(() => {
    if (!src) {
      return;
    }
    const img = new Image();
    img.onload = handleLoad;
    img.onerror = handleError;
    if (src) img.src = src;
    if (srcSet) img.srcset = srcSet;
    if (sizes) img.sizes = sizes;
    if (crossOrigin) img.crossOrigin = crossOrigin;
    imgRef.current = img;
  }, [crossOrigin, handleError, handleLoad, sizes, src, srcSet]);
  useIsomorphicLayoutEffect(() => {
    if (status === 'loading') {
      loadImge();
    }
  }, [loadImge, status]);
  useEffect(() => {
    return flush;
  }, []);
  return {
    loaded: status === 'loaded',
    status
  };
};
export default useImage;