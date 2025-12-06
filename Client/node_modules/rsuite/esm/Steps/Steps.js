'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import StepItem from "./StepItem.js";
import Box from "../internals/Box/index.js";
import { forwardRef, rch } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const Subcomponents = {
  Item: StepItem
};

/**
 * The `Steps` component is used to guide users to complete tasks in accordance with the process.
 *
 * @see https://rsuitejs.com/components/steps
 */
const Steps = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Steps', props);
  const {
    as,
    classPrefix = 'steps',
    className,
    children,
    vertical,
    small,
    current = 0,
    currentStatus = 'process',
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const items = useMemo(() => {
    const count = rch.count(children);
    return rch.mapCloneElement(children, (item, index) => {
      const itemStyles = {
        flexBasis: index < count - 1 ? `${100 / (count - 1)}%` : undefined,
        maxWidth: index === count - 1 ? `${100 / count}%` : undefined
      };
      const itemProps = {
        stepNumber: index + 1,
        status: 'wait',
        style: !vertical ? itemStyles : undefined,
        ...item.props
      };

      // fix tail color
      if (currentStatus === 'error' && index === current - 1) {
        itemProps['data-next-error'] = true;
      }
      if (!item.props.status) {
        if (index === current) {
          itemProps.status = currentStatus;
        } else if (index < current) {
          itemProps.status = 'finish';
        }
      }
      return itemProps;
    });
  }, [children, current, currentStatus, vertical]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    "data-size": small ? 'small' : undefined,
    "data-direction": vertical ? 'vertical' : 'horizontal'
  }, rest), items);
}, Subcomponents);
Steps.displayName = 'Steps';
export default Steps;