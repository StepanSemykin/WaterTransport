'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useMemo } from 'react';
import StyledBox from "../internals/StyledBox/index.js";
import AvatarIcon from "./AvatarIcon.js";
import useImage from "./useImage.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { AvatarGroupContext } from "../AvatarGroup/AvatarGroup.js";
/**
 * The Avatar component is used to represent user or brand.
 * @see https://rsuitejs.com/components/avatar
 */
const Avatar = forwardRef((props, ref) => {
  const {
    size: groupSize
  } = useContext(AvatarGroupContext);
  const {
    propsWithDefaults
  } = useCustom('Avatar', props);
  const {
    as = 'div',
    bordered,
    alt,
    className,
    children,
    circle,
    color,
    classPrefix = 'avatar',
    size = groupSize,
    src,
    srcSet,
    sizes,
    imgProps,
    onError,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    circle,
    bordered
  }));
  const imageProps = {
    ...imgProps,
    alt,
    src,
    srcSet,
    sizes
  };
  const {
    loaded
  } = useImage({
    ...imageProps,
    onError
  });
  const altComponent = useMemo(() => {
    if (alt) {
      return /*#__PURE__*/React.createElement("span", {
        role: "img",
        "aria-label": alt
      }, alt);
    }
    return null;
  }, [alt]);
  const placeholder = children || altComponent || /*#__PURE__*/React.createElement(AvatarIcon, {
    className: prefix`icon`
  });
  const image = loaded ? /*#__PURE__*/React.createElement("img", _extends({}, imageProps, {
    className: prefix`image`
  })) : placeholder;
  return /*#__PURE__*/React.createElement(StyledBox, _extends({
    as: as,
    name: "avatar",
    size: size,
    color: color,
    ref: ref,
    className: classes
  }, rest), src ? image : placeholder);
});
Avatar.displayName = 'Avatar';
export default Avatar;