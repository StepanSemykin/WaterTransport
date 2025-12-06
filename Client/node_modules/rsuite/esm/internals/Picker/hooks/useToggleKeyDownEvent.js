'use client';
import { KEY_VALUES } from "../../constants/index.js";
import { useEventCallback } from "../../hooks/index.js";
/**
 * A hook to control the toggle keyboard operation
 * @param props
 */
const useToggleKeyDownEvent = props => {
  const {
    toggle = true,
    trigger,
    target,
    overlay,
    searchInput,
    active,
    readOnly,
    disabled,
    loading,
    onExit,
    onKeyDown,
    onMenuKeyDown,
    onMenuPressEnter,
    onMenuPressBackspace
  } = props;
  const handleClose = useEventCallback(() => {
    var _trigger$current, _trigger$current$clos, _trigger$current2, _trigger$current2$foc;
    (_trigger$current = trigger.current) === null || _trigger$current === void 0 || (_trigger$current$clos = _trigger$current.close) === null || _trigger$current$clos === void 0 || _trigger$current$clos.call(_trigger$current);

    // The focus is on the trigger button after closing
    (_trigger$current2 = trigger.current) === null || _trigger$current2 === void 0 || (_trigger$current2$foc = _trigger$current2.focus) === null || _trigger$current2$foc === void 0 || _trigger$current2$foc.call(_trigger$current2);
  });
  const handleOpen = useEventCallback(() => {
    var _trigger$current3, _trigger$current3$ope;
    (_trigger$current3 = trigger.current) === null || _trigger$current3 === void 0 || (_trigger$current3$ope = _trigger$current3.open) === null || _trigger$current3$ope === void 0 || _trigger$current3$ope.call(_trigger$current3);
  });
  const handleToggleDropdown = useEventCallback(() => {
    if (active) {
      handleClose();
      return;
    }
    handleOpen();
  });
  const onToggle = useEventCallback(event => {
    // Keyboard events should not be processed when readOnly and disabled are set.
    if (readOnly || disabled || loading) {
      return;
    }
    if (event.target === (target === null || target === void 0 ? void 0 : target.current)) {
      // enter
      if (toggle && event.key === KEY_VALUES.ENTER) {
        handleToggleDropdown();
      }

      // delete
      if (event.key === KEY_VALUES.BACKSPACE) {
        onExit === null || onExit === void 0 || onExit(event);
      }
    }
    if (overlay !== null && overlay !== void 0 && overlay.current) {
      // The keyboard operation callback on the menu.
      onMenuKeyDown === null || onMenuKeyDown === void 0 || onMenuKeyDown(event);
      if (event.key === KEY_VALUES.ENTER) {
        onMenuPressEnter === null || onMenuPressEnter === void 0 || onMenuPressEnter(event);
      }

      /**
       * There is no callback when typing the Backspace key in the search box.
       * The default is to remove search keywords
       */
      if (event.key === KEY_VALUES.BACKSPACE && event.target !== (searchInput === null || searchInput === void 0 ? void 0 : searchInput.current)) {
        onMenuPressBackspace === null || onMenuPressBackspace === void 0 || onMenuPressBackspace(event);
      }

      // The search box gets focus when typing characters and numbers.
      if (event.key.length === 1 && /\w/.test(event.key)) {
        var _event$target;
        // Exclude Input
        // eg: <SelectPicker renderExtraFooter={() => <Input />} />
        if (((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.tagName) !== 'INPUT') {
          var _searchInput$current;
          searchInput === null || searchInput === void 0 || (_searchInput$current = searchInput.current) === null || _searchInput$current === void 0 || _searchInput$current.focus();
        }
      }
    }
    if (event.key === KEY_VALUES.ESC || event.key === KEY_VALUES.TAB) {
      handleClose();
    }

    // Native event callback
    onKeyDown === null || onKeyDown === void 0 || onKeyDown(event);
  });
  return onToggle;
};
export default useToggleKeyDownEvent;