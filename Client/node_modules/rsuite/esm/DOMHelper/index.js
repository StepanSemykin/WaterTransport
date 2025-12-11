'use client';
import * as helpers from 'dom-lib';
import isElement from "./isElement.js";
export * from 'dom-lib';

/**
 * a wrapper of dom-lib with some custom methods.
 * @see https://rsuitejs.com/components/dom-helper/
 */
export const DOMHelper = {
  ...helpers,
  isElement
};
export default DOMHelper;