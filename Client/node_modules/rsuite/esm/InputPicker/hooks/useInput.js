'use client';
import { useRef, useCallback, useMemo } from 'react';
import useMaxWidth from "./useMaxWidth.js";
import InputAutosize from "../InputAutosize.js";
const INPUT_MARGIN_RIGHT = 60;
function useInput(props) {
  const {
    multi,
    triggerRef
  } = props;
  const inputRef = useRef(null);
  const maxWidth = useMaxWidth(triggerRef);
  const getInput = useCallback(() => {
    var _inputRef$current;
    return multi ? (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 ? void 0 : _inputRef$current.input : inputRef.current;
  }, [multi]);
  const focus = useCallback(() => {
    var _getInput;
    (_getInput = getInput()) === null || _getInput === void 0 || _getInput.focus();
  }, [getInput]);
  const blur = useCallback(() => {
    var _getInput2;
    (_getInput2 = getInput()) === null || _getInput2 === void 0 || _getInput2.blur();
  }, [getInput]);
  const inputProps = useMemo(() => {
    return multi ? {
      inputStyle: {
        maxWidth: maxWidth - INPUT_MARGIN_RIGHT
      },
      as: InputAutosize
    } : {
      as: 'input'
    };
  }, [maxWidth, multi]);
  return {
    inputProps,
    inputRef,
    focus,
    blur
  };
}
export default useInput;