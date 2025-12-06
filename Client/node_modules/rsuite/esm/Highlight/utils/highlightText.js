'use client';
import { getSafeRegExpString } from "../../internals/utils/index.js";
export function highlightText(text, props) {
  const {
    query,
    renderMark
  } = props;
  if (!query || !text) {
    return text;
  }
  const queries = Array.isArray(query) ? query : [query];
  const regx = new RegExp(queries.map(q => getSafeRegExpString(q)).join('|'), 'ig');
  const texts = [];
  const strArr = text.split(regx);
  const highStrArr = text.match(regx);
  for (let i = 0; i < strArr.length; i++) {
    if (strArr[i]) {
      texts.push(strArr[i]);
    }
    if (highStrArr !== null && highStrArr !== void 0 && highStrArr[i]) {
      texts.push(renderMark(highStrArr[i], i));
    }
  }
  return texts;
}