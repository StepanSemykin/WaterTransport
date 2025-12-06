'use client';
import React from 'react';
import getTransitionEnd from 'dom-lib/getTransitionEnd';
import on from 'dom-lib/on';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import { getDOMNode } from "../internals/utils/index.js";
import { getAnimationEnd } from "./utils.js";
export let STATUS = /*#__PURE__*/function (STATUS) {
  STATUS[STATUS["UNMOUNTED"] = 0] = "UNMOUNTED";
  STATUS[STATUS["EXITED"] = 1] = "EXITED";
  STATUS[STATUS["ENTERING"] = 2] = "ENTERING";
  STATUS[STATUS["ENTERED"] = 3] = "ENTERED";
  STATUS[STATUS["EXITING"] = 4] = "EXITING";
  return STATUS;
}({});
const transitionProps = ['onEnter', 'onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited', 'animation', 'children', 'className', 'in', 'unmountOnExit', 'transitionAppear', 'timeout', 'exitedClassName', 'exitingClassName', 'enteredClassName', 'enteringClassName'];

/**
 * A Transition component for animation.
 * @see https://rsuitejs.com/components/animation/#transition
 */
class Transition extends React.Component {
  constructor(props) {
    super(props);
    this.animationEventListener = null;
    this.instanceElement = null;
    this.nextCallback = null;
    this.needsUpdate = null;
    this.childRef = void 0;
    let initialStatus;
    if (props.in) {
      initialStatus = props.transitionAppear ? STATUS.EXITED : STATUS.ENTERED;
    } else {
      initialStatus = props.unmountOnExit ? STATUS.UNMOUNTED : STATUS.EXITED;
    }
    this.state = {
      status: initialStatus
    };
    this.nextCallback = null;
    this.childRef = /*#__PURE__*/React.createRef();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.in && nextProps.unmountOnExit) {
      if (prevState.status === STATUS.UNMOUNTED) {
        // Start enter transition in componentDidUpdate.
        return {
          status: STATUS.EXITED
        };
      }
    }
    return null;
  }
  getSnapshotBeforeUpdate() {
    if (!this.props.in || !this.props.unmountOnExit) {
      this.needsUpdate = true;
    }
    return null;
  }
  componentDidMount() {
    if (this.props.transitionAppear && this.props.in) {
      this.performEnter(this.props);
    }
  }
  componentDidUpdate() {
    const {
      status
    } = this.state;
    const {
      unmountOnExit
    } = this.props;
    if (unmountOnExit && status === STATUS.EXITED) {
      if (this.props.in) {
        this.performEnter(this.props);
      } else {
        if (this.instanceElement) {
          this.setState({
            status: STATUS.UNMOUNTED
          });
        }
      }
      return;
    }
    if (this.needsUpdate) {
      this.needsUpdate = false;
      if (this.props.in) {
        if (status === STATUS.EXITING || status === STATUS.EXITED) {
          this.performEnter(this.props);
        }
      } else if (status === STATUS.ENTERING || status === STATUS.ENTERED) {
        this.performExit(this.props);
      }
    }
  }
  componentWillUnmount() {
    this.cancelNextCallback();
    this.instanceElement = null;
  }
  onTransitionEnd(node, handler) {
    var _this$animationEventL;
    this.setNextCallback(handler);
    (_this$animationEventL = this.animationEventListener) === null || _this$animationEventL === void 0 || _this$animationEventL.off();
    if (!this.nextCallback) {
      return;
    }
    if (node) {
      const {
        timeout,
        animation
      } = this.props;
      this.animationEventListener = on(node, animation ? getAnimationEnd() : getTransitionEnd(), this.nextCallback);
      if (timeout !== null) {
        setTimeout(this.nextCallback, timeout);
      }
    } else {
      setTimeout(this.nextCallback, 0);
    }
  }
  setNextCallback(callback) {
    let active = true;
    this.nextCallback = event => {
      if (!active) {
        return;
      }
      if (event) {
        if (this.instanceElement === event.target) {
          callback(event);
          active = false;
          this.nextCallback = null;
        }
        return;
      }
      callback(event);
      active = false;
      this.nextCallback = null;
    };
    if (this.nextCallback) {
      this.nextCallback.cancel = () => {
        active = false;
      };
    }
    return this.nextCallback;
  }
  getChildElement() {
    if (this.childRef.current) {
      return getDOMNode(this.childRef.current);
    }
    return getDOMNode(this);
  }
  performEnter(props) {
    const {
      onEnter,
      onEntering,
      onEntered
    } = props || this.props;
    this.cancelNextCallback();
    const node = this.getChildElement();
    this.instanceElement = node;
    onEnter === null || onEnter === void 0 || onEnter(node);
    this.safeSetState({
      status: STATUS.ENTERING
    }, () => {
      onEntering === null || onEntering === void 0 || onEntering(node);
      this.onTransitionEnd(node, () => {
        this.safeSetState({
          status: STATUS.ENTERED
        }, () => {
          onEntered === null || onEntered === void 0 || onEntered(node);
        });
      });
    });
  }
  performExit(props) {
    const {
      onExit,
      onExiting,
      onExited
    } = props || this.props;
    this.cancelNextCallback();
    const node = this.getChildElement();
    this.instanceElement = node;
    onExit === null || onExit === void 0 || onExit(node);
    this.safeSetState({
      status: STATUS.EXITING
    }, () => {
      onExiting === null || onExiting === void 0 || onExiting(node);
      this.onTransitionEnd(node, () => {
        this.safeSetState({
          status: STATUS.EXITED
        }, () => {
          onExited === null || onExited === void 0 || onExited(node);
        });
      });
    });
  }
  cancelNextCallback() {
    if (this.nextCallback !== null) {
      this.nextCallback.cancel();
      this.nextCallback = null;
    }
  }
  safeSetState(nextState, callback) {
    if (this.instanceElement) {
      const nextCallback = this.setNextCallback(callback);
      this.setState(nextState, () => nextCallback === null || nextCallback === void 0 ? void 0 : nextCallback());
    }
  }
  render() {
    var _child$props;
    const status = this.state.status;
    if (status === STATUS.UNMOUNTED) {
      return null;
    }
    const {
      children,
      className,
      exitedClassName,
      enteringClassName,
      enteredClassName,
      exitingClassName,
      ...rest
    } = this.props;
    const childProps = omit(rest, transitionProps);
    let transitionClassName;
    if (status === STATUS.EXITED) {
      transitionClassName = exitedClassName;
    } else if (status === STATUS.ENTERING) {
      transitionClassName = enteringClassName;
    } else if (status === STATUS.ENTERED) {
      transitionClassName = enteredClassName;
    } else if (status === STATUS.EXITING) {
      transitionClassName = exitingClassName;
    }
    if (isFunction(children)) {
      childProps.className = classNames(className, transitionClassName);
      return children(childProps, this.childRef);
    }
    const child = React.Children.only(children);
    return /*#__PURE__*/React.cloneElement(child, {
      ...childProps,
      ref: this.childRef,
      className: classNames(className, (_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.className, transitionClassName)
    });
  }
}
Transition.displayName = 'Transition';
Transition.defaultProps = {
  timeout: 1000
};
export default Transition;