'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
var _exportNames = {
  Overlay: true
};
exports.default = void 0;
var _Overlay = _interopRequireDefault(require("./Overlay"));
exports.Overlay = _Overlay.default;
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  exports[key] = _types[key];
});
// export types
// export components
var _default = exports.default = _Overlay.default;