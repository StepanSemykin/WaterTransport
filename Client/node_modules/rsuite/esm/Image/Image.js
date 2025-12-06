'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { ImageWrapper } from "./ImageWrapper.js";
import { useImage } from "./hooks/useImage.js";
const Image = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Image', props);
  const {
    as = 'img',
    bordered,
    classPrefix = 'image',
    className,
    circle,
    crossOrigin,
    fit,
    fallbackSrc,
    loading,
    rounded,
    srcSet,
    sizes,
    shaded,
    src,
    style,
    position,
    placeholder,
    width,
    height,
    zoomed,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    circle,
    bordered,
    rounded,
    shaded,
    zoomed
  }));
  const {
    imgSrc,
    isLoading,
    onLoad,
    onError
  } = useImage({
    src,
    fallbackSrc
  });
  const styles = {
    ...style,
    ['--rs-object-fit']: fit,
    ['--rs-object-position']: position
  };
  const image = /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    src: imgSrc,
    className: classes,
    style: styles,
    width: width,
    height: height,
    loading: loading,
    onLoad: onLoad,
    onError: onError,
    crossOrigin: crossOrigin,
    srcSet: srcSet,
    sizes: sizes
  }, rest));
  if (zoomed) {
    return /*#__PURE__*/React.createElement(ImageWrapper, {
      w: width,
      h: height
    }, image);
  }
  if (placeholder) {
    return /*#__PURE__*/React.createElement(ImageWrapper, {
      w: width,
      h: height
    }, isLoading && placeholder, image);
  }
  return image;
});
Image.displayName = 'Image';
export default Image;