'use client';
import addClass from 'dom-lib/addClass';
import removeClass from 'dom-lib/removeClass';
import addStyle from 'dom-lib/addStyle';
import getStyle from 'dom-lib/getStyle';
import getScrollbarSize from 'dom-lib/getScrollbarSize';
import isOverflowing from 'dom-lib/isOverflowing';
function findIndexOf(arr, cb) {
  let index = -1;
  arr.some((d, i) => {
    if (cb(d, i)) {
      index = i;
      return true;
    }
    return false;
  });
  return index;
}
function findContainer(data, modal) {
  return findIndexOf(data, d => d.modals.indexOf(modal) !== -1);
}
class ModalManager {
  constructor() {
    this.modals = [];
    this.containers = [];
    this.data = [];
  }
  add(modal, container, className) {
    let modalIndex = this.modals.indexOf(modal);
    const containerIndex = this.containers.indexOf(container);
    if (modalIndex !== -1) {
      return modalIndex;
    }
    modalIndex = this.modals.length;
    this.modals.push(modal);
    if (containerIndex !== -1) {
      this.data[containerIndex].modals.push(modal);
      return modalIndex;
    }
    const containerState = {
      modals: [modal],
      classes: className ? className.split(/\s+/) : [],
      style: {
        overflow: container.style.overflow,
        paddingRight: container.style.paddingRight
      },
      overflowing: isOverflowing(container)
    };
    if (containerState.overflowing) {
      const paddingRight = parseInt(getStyle(container, 'paddingRight') || 0, 10);
      const barSize = getScrollbarSize();
      addStyle(container, {
        paddingRight: (barSize ? paddingRight + barSize : paddingRight) + 'px'
      });
    }
    containerState.classes.forEach(addClass.bind(null, container));
    this.containers.push(container);
    this.data.push(containerState);
    return modalIndex;
  }
  remove(modal) {
    const modalIndex = this.modals.indexOf(modal);
    if (modalIndex === -1) {
      return;
    }
    const containerIndex = findContainer(this.data, modal);
    const containerState = this.data[containerIndex];
    const container = this.containers[containerIndex];
    containerState.modals.splice(containerState.modals.indexOf(modal), 1);
    this.modals.splice(modalIndex, 1);
    if (containerState.modals.length === 0) {
      Object.keys(containerState.style).forEach(key => container.style[key] = containerState.style[key]);
      containerState.classes.forEach(removeClass.bind(null, container));
      this.containers.splice(containerIndex, 1);
      this.data.splice(containerIndex, 1);
    }
  }
  isTopModal(modal) {
    return !!this.modals.length && this.modals[this.modals.length - 1] === modal;
  }
}
export default ModalManager;