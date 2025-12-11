'use client';
/**
 * Partial implementation of Node API
 * Used for holding tree nodes hierarchy
 * Ref: https://developer.mozilla.org/zh-CN/docs/Web/API/Node
 */
export class Node {
  constructor() {
    this.id = null;
    this.nodeValue = null;
    this.parent = null;
    this.parentNode = null;
    this.childNodes = [];
    this.element = void 0;
  }
  appendChild(newChild) {
    newChild.parentNode = this;
    this.childNodes.push(newChild);
  }
  hasChildNodes() {
    return this.childNodes.length > 0;
  }
  get firstChild() {
    var _this$childNodes$;
    return (_this$childNodes$ = this.childNodes[0]) !== null && _this$childNodes$ !== void 0 ? _this$childNodes$ : null;
  }
  get lastChild() {
    var _this$childNodes;
    return (_this$childNodes = this.childNodes[this.childNodes.length - 1]) !== null && _this$childNodes !== void 0 ? _this$childNodes : null;
  }
  get nextSibling() {
    var _this$parentNode$chil;
    if (!this.parentNode) return null;
    return (_this$parentNode$chil = this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) + 1]) !== null && _this$parentNode$chil !== void 0 ? _this$parentNode$chil : null;
  }
  get previousSibling() {
    var _this$parentNode$chil2;
    if (!this.parentNode) return null;
    return (_this$parentNode$chil2 = this.parentNode.childNodes[this.parentNode.childNodes.indexOf(this) - 1]) !== null && _this$parentNode$chil2 !== void 0 ? _this$parentNode$chil2 : null;
  }
}