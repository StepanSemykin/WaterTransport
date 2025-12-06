'use client';
import ToastContainer, { defaultToasterContainer } from "./ToastContainer.js";
import { RSUITE_TOASTER_ID } from "../internals/symbols.js";
const containers = new Map();

/**
 * Create a container instance.
 * @param placement
 * @param props
 */
async function createContainer(placement, props) {
  const [container, containerId] = await ToastContainer.getInstance(props);
  containers.set(`${containerId}_${placement}`, container);
  return container;
}

/**
 * Get the container by ID. Use default ID when ID is not available.
 * @param containerId
 * @param placement
 */
function getContainer(containerId, placement) {
  return containers.get(`${containerId}_${placement}`);
}
const toaster = message => toaster.push(message);
toaster.push = (message, options = {}) => {
  const {
    placement = 'topCenter',
    container = defaultToasterContainer,
    ...restOptions
  } = options;
  const containerElement = typeof container === 'function' ? container() : container;
  const containerElementId = containerElement ? containerElement[RSUITE_TOASTER_ID] : null;
  if (containerElementId) {
    const existedContainer = getContainer(containerElementId, placement);
    if (existedContainer) {
      var _existedContainer$cur;
      return (_existedContainer$cur = existedContainer.current) === null || _existedContainer$cur === void 0 ? void 0 : _existedContainer$cur.push(message, restOptions);
    }
  }
  const newOptions = {
    ...options,
    container: containerElement,
    placement
  };
  return createContainer(placement, newOptions).then(ref => {
    var _ref$current;
    return (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.push(message, restOptions);
  });
};
toaster.remove = key => {
  containers.forEach(c => {
    var _c$current;
    return (_c$current = c.current) === null || _c$current === void 0 ? void 0 : _c$current.remove(key);
  });
};
toaster.clear = () => {
  containers.forEach(c => {
    var _c$current2;
    return (_c$current2 = c.current) === null || _c$current2 === void 0 ? void 0 : _c$current2.clear();
  });
};
export default toaster;