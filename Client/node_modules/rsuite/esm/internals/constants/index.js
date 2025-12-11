'use client';
export const SIZE = ['xs', 'sm', 'md', 'lg'];
export const BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
export const STATUS = ['success', 'warning', 'error', 'info'];
export const COLOR = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet'];
export const PLACEMENT_4 = ['top', 'bottom', 'right', 'left'];
export const PLACEMENT_8 = ['bottomStart', 'bottomEnd', 'topStart', 'topEnd', 'leftStart', 'rightStart', 'leftEnd', 'rightEnd'];
export const PLACEMENT_AUTO = ['auto', 'autoVertical', 'autoVerticalStart', 'autoVerticalEnd', 'autoHorizontal', 'autoHorizontalStart', 'autoHorizontalEnd'];
export const PLACEMENT = [...PLACEMENT_4, ...PLACEMENT_8, ...PLACEMENT_AUTO];

/**
 *  Check Tree Node State
 */
export let CHECK_STATE = /*#__PURE__*/function (CHECK_STATE) {
  CHECK_STATE[CHECK_STATE["UNCHECK"] = 0] = "UNCHECK";
  CHECK_STATE[CHECK_STATE["CHECK"] = 1] = "CHECK";
  CHECK_STATE[CHECK_STATE["INDETERMINATE"] = 2] = "INDETERMINATE";
  return CHECK_STATE;
}({});
/**
 * Tree Node Drag Type
 */
export let TREE_NODE_DROP_POSITION = /*#__PURE__*/function (TREE_NODE_DROP_POSITION) {
  TREE_NODE_DROP_POSITION[TREE_NODE_DROP_POSITION["DRAG_OVER"] = 0] = "DRAG_OVER";
  TREE_NODE_DROP_POSITION[TREE_NODE_DROP_POSITION["DRAG_OVER_TOP"] = 1] = "DRAG_OVER_TOP";
  TREE_NODE_DROP_POSITION[TREE_NODE_DROP_POSITION["DRAG_OVER_BOTTOM"] = 2] = "DRAG_OVER_BOTTOM";
  return TREE_NODE_DROP_POSITION;
}({});

/**
 * UI Events KeyboardEvent key Values
 * https://www.w3.org/TR/uievents-key
 */
export const KEY_VALUES = {
  // Navigation Keys
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  END: 'End',
  HOME: 'Home',
  PAGE_DOWN: 'PageDown',
  PAGE_UP: 'PageUp',
  // Whitespace Keys
  ENTER: 'Enter',
  TAB: 'Tab',
  SPACE: ' ',
  // Editing Keys
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  COMMA: ',',
  // UI Keys
  ESC: 'Escape'
};
export let DATERANGE_DISABLED_TARGET = /*#__PURE__*/function (DATERANGE_DISABLED_TARGET) {
  DATERANGE_DISABLED_TARGET["CALENDAR"] = "CALENDAR";
  DATERANGE_DISABLED_TARGET["TOOLBAR_BUTTON_OK"] = "TOOLBAR_BUTTON_OK";
  DATERANGE_DISABLED_TARGET["TOOLBAR_SHORTCUT"] = "TOOLBAR_SHORTCUT";
  DATERANGE_DISABLED_TARGET["INPUT"] = "INPUT";
  return DATERANGE_DISABLED_TARGET;
}({});