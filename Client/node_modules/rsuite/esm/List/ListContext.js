'use client';
import React from 'react';
import noop from 'lodash/noop';
const ListContext = /*#__PURE__*/React.createContext({
  bordered: false,
  size: 'md',
  register: () => ({
    unregister: noop
  })
});
export default ListContext;