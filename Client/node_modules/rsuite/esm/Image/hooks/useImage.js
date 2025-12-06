'use client';
import { useState, useEffect } from 'react';
export const useImage = props => {
  const {
    src,
    fallbackSrc
  } = props;
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc || null);
  const [isLoading, setIsLoading] = useState(!!src);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }
    setImgSrc(src);
    setIsLoading(true);
    setError(false);
  }, [src]);
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    setImgSrc(fallbackSrc || null);
  };
  return {
    imgSrc,
    isLoading,
    error,
    onLoad: handleLoad,
    onError: handleError
  };
};