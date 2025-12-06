'use client';
import { useRef } from 'react';
import useDisclosureContext from "./useDisclosureContext.js";
function DisclosureContent(props) {
  const {
    children
  } = props;
  const elementRef = useRef(null);
  const disclosure = useDisclosureContext(DisclosureContent.displayName);
  const [{
    open
  }] = disclosure;
  return children({
    open
  }, elementRef);
}
DisclosureContent.displayName = 'Disclosure.Content';
export default DisclosureContent;