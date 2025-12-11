'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useRef, useImperativeHandle, useReducer, useEffect } from 'react';
import find from 'lodash/find';
import FileItem from "./UploadFileItem.js";
import Plaintext from "../internals/Plaintext/index.js";
import ajaxUpload from "./utils/ajaxUpload.js";
import UploadTrigger from "./UploadTrigger.js";
import Box from "../internals/Box/index.js";
import { forwardRef, guid } from "../internals/utils/index.js";
import { useStyles, useCustom, useWillUnmount, useEventCallback } from "../internals/hooks/index.js";

// Define several states of the file during the upload process.

const getFiles = event => {
  if (typeof (event === null || event === void 0 ? void 0 : event['dataTransfer']) === 'object') {
    var _event$dataTransfer;
    return event === null || event === void 0 || (_event$dataTransfer = event['dataTransfer']) === null || _event$dataTransfer === void 0 ? void 0 : _event$dataTransfer.files;
  }
  if (event.target) {
    return event.target['files'];
  }
  return [];
};
const createFile = file => {
  const {
    fileKey
  } = file;
  return {
    ...file,
    fileKey: fileKey || guid(),
    progress: 0
  };
};
function fileListReducer(files, action) {
  var _action$files;
  switch (action.type) {
    // Add one or more files
    case 'push':
      return [...files, ...action.files];

    // Remove a file by `fileKey`
    case 'remove':
      return files.filter(f => f.fileKey !== action.fileKey);

    // Update a file
    case 'updateFile':
      return files.map(file => {
        return file.fileKey === action.file.fileKey ? action.file : file;
      });

    // Initialization file list
    case 'init':
      return ((_action$files = action.files) === null || _action$files === void 0 ? void 0 : _action$files.map(file => {
        // The state of the file needs to be preserved when the `fileList` is controlled.
        return files.find(f => f.fileKey === file.fileKey) || createFile(file);
      })) || [];
    default:
      throw new Error();
  }
}
const useFileList = (defaultFileList = []) => {
  const fileListRef = useRef(defaultFileList.map(createFile));
  const fileListUpdateCallback = useRef(null);
  const [fileList, dispatch] = useReducer(fileListReducer, fileListRef.current);
  fileListRef.current = fileList;
  useEffect(() => {
    var _fileListUpdateCallba;
    (_fileListUpdateCallba = fileListUpdateCallback.current) === null || _fileListUpdateCallba === void 0 || _fileListUpdateCallba.call(fileListUpdateCallback, fileList);
    fileListUpdateCallback.current = null;
  }, [fileList]);
  useWillUnmount(() => {
    fileListUpdateCallback.current = null;
  });
  const dispatchCallback = useCallback((action, callback) => {
    dispatch(action);
    fileListUpdateCallback.current = callback;
  }, []);
  return [fileListRef, dispatchCallback];
};

/**
 * The `Uploader` component is used to upload files.
 *
 * @see https://rsuitejs.com/components/uploader
 */
const Uploader = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Uploader', props);
  const {
    as,
    classPrefix = 'uploader',
    className,
    listType = 'text',
    defaultFileList,
    fileList: fileListProp,
    fileListVisible = true,
    locale,
    style,
    draggable,
    name = 'file',
    multiple = false,
    disabled = false,
    readOnly,
    plaintext,
    accept,
    children,
    toggleAs,
    removable = true,
    disabledFileItem,
    maxPreviewFileSize,
    method = 'POST',
    autoUpload = true,
    action,
    headers,
    withCredentials = false,
    disableMultipart,
    timeout = 0,
    data = {},
    onRemove,
    onUpload,
    shouldUpload,
    shouldQueueUpdate,
    renderFileInfo,
    renderThumbnail,
    onPreview,
    onChange,
    onSuccess,
    onError,
    onProgress,
    onReupload,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const rootRef = useRef(null);
  const xhrs = useRef({});
  const trigger = useRef(null);
  const [fileList, dispatch] = useFileList(fileListProp || defaultFileList);
  useEffect(() => {
    if (typeof fileListProp !== 'undefined') {
      // Force reset fileList in reducer, when `fileListProp` is updated
      dispatch({
        type: 'init',
        files: fileListProp
      });
    }
  }, [dispatch, fileListProp]);
  const updateFileStatus = useCallback(nextFile => {
    dispatch({
      type: 'updateFile',
      file: nextFile
    });
  }, [dispatch]);

  /**
   * Clear the value in input.
   */
  const cleanInputValue = useCallback(() => {
    var _trigger$current;
    (_trigger$current = trigger.current) === null || _trigger$current === void 0 || _trigger$current.clearInput();
  }, []);

  /**
   * Callback for successful file upload.
   * @param file
   * @param response
   * @param event
   * @param xhr
   */
  const handleAjaxUploadSuccess = useCallback((file, response, event, xhr) => {
    const nextFile = {
      ...file,
      status: 'finished',
      progress: 100
    };
    updateFileStatus(nextFile);
    onSuccess === null || onSuccess === void 0 || onSuccess(response, nextFile, event, xhr);
  }, [onSuccess, updateFileStatus]);

  /**
   * Callback for file upload error.
   * @param file
   * @param status
   * @param event
   * @param xhr
   */
  const handleAjaxUploadError = useCallback((file, status, event, xhr) => {
    const nextFile = {
      ...file,
      status: 'error'
    };
    updateFileStatus(nextFile);
    onError === null || onError === void 0 || onError(status, nextFile, event, xhr);
  }, [onError, updateFileStatus]);

  /**
   * Callback for file upload progress update.
   * @param file
   * @param percent
   * @param event
   * @param xhr
   */
  const handleAjaxUploadProgress = useCallback((file, percent, event, xhr) => {
    const nextFile = {
      ...file,
      status: 'uploading',
      progress: percent
    };
    updateFileStatus(nextFile);
    onProgress === null || onProgress === void 0 || onProgress(percent, nextFile, event, xhr);
  }, [onProgress, updateFileStatus]);

  /**
   * Upload a single file.
   * @param file
   */
  const handleUploadFile = useEventCallback(file => {
    const {
      xhr,
      data: uploadData
    } = ajaxUpload({
      name,
      timeout,
      headers,
      data,
      method,
      withCredentials,
      disableMultipart,
      file: file.blobFile,
      url: action,
      onError: handleAjaxUploadError.bind(null, file),
      onSuccess: handleAjaxUploadSuccess.bind(null, file),
      onProgress: handleAjaxUploadProgress.bind(null, file)
    });
    updateFileStatus({
      ...file,
      status: 'uploading'
    });
    if (file.fileKey) {
      xhrs.current[file.fileKey] = xhr;
    }
    onUpload === null || onUpload === void 0 || onUpload(file, uploadData, xhr);
  });
  const handleAjaxUpload = useEventCallback(() => {
    fileList.current.forEach(file => {
      const checkState = shouldUpload === null || shouldUpload === void 0 ? void 0 : shouldUpload(file);
      if (checkState instanceof Promise) {
        checkState.then(res => {
          if (res) {
            handleUploadFile(file);
          }
        });
        return;
      } else if (checkState === false) {
        return;
      }
      if (file.status === 'inited') {
        handleUploadFile(file);
      }
    });
    cleanInputValue();
  });
  const handleUploadTriggerChange = useEventCallback(event => {
    const files = getFiles(event);
    const newFileList = [];
    Array.from(files).forEach(file => {
      newFileList.push({
        blobFile: file,
        name: file.name,
        status: 'inited',
        fileKey: guid()
      });
    });
    const nextFileList = [...fileList.current, ...newFileList];
    const checkState = shouldQueueUpdate === null || shouldQueueUpdate === void 0 ? void 0 : shouldQueueUpdate(nextFileList, newFileList);
    if (checkState === false) {
      cleanInputValue();
      return;
    }
    const upload = () => {
      onChange === null || onChange === void 0 || onChange(nextFileList, event);
      if (rootRef.current) {
        dispatch({
          type: 'push',
          files: newFileList
        }, () => {
          autoUpload && handleAjaxUpload();
        });
      }
    };
    if (checkState instanceof Promise) {
      checkState.then(res => {
        res && upload();
      });
      return;
    }
    upload();
  });
  const handleRemoveFile = useEventCallback((fileKey, event) => {
    var _xhrs$current;
    const file = find(fileList.current, f => f.fileKey === fileKey);
    const nextFileList = fileList.current.filter(f => f.fileKey !== fileKey);
    if (((_xhrs$current = xhrs.current) === null || _xhrs$current === void 0 || (_xhrs$current = _xhrs$current[file.fileKey]) === null || _xhrs$current === void 0 ? void 0 : _xhrs$current.readyState) !== 4) {
      var _xhrs$current$file$fi;
      (_xhrs$current$file$fi = xhrs.current[file.fileKey]) === null || _xhrs$current$file$fi === void 0 || _xhrs$current$file$fi.abort();
    }
    dispatch({
      type: 'remove',
      fileKey
    });
    onRemove === null || onRemove === void 0 || onRemove(file);
    onChange === null || onChange === void 0 || onChange(nextFileList, event);
    cleanInputValue();
  });
  const handleReupload = useEventCallback(file => {
    autoUpload && handleUploadFile(file);
    onReupload === null || onReupload === void 0 || onReupload(file);
  });

  // public API
  const start = useCallback(file => {
    if (file) {
      handleUploadFile(file);
      return;
    }
    handleAjaxUpload();
  }, [handleAjaxUpload, handleUploadFile]);
  useImperativeHandle(ref, () => ({
    root: rootRef.current,
    start
  }));
  const renderList = [/*#__PURE__*/React.createElement(UploadTrigger, _extends({}, rest, {
    locale: locale,
    name: name,
    key: "trigger",
    multiple: multiple,
    draggable: draggable,
    disabled: disabled,
    readOnly: readOnly,
    accept: accept,
    ref: trigger,
    onChange: handleUploadTriggerChange,
    as: toggleAs
  }), children)];
  if (fileListVisible) {
    renderList.push(/*#__PURE__*/React.createElement("div", {
      key: "items",
      className: prefix('file-items')
    }, fileList.current.map((file, index) => /*#__PURE__*/React.createElement(FileItem, {
      locale: locale,
      key: file.fileKey || index,
      file: file,
      maxPreviewFileSize: maxPreviewFileSize,
      listType: listType,
      disabled: disabledFileItem,
      onPreview: onPreview,
      onReupload: handleReupload,
      onCancel: handleRemoveFile,
      renderFileInfo: renderFileInfo,
      renderThumbnail: renderThumbnail,
      removable: removable && !readOnly && !plaintext,
      allowReupload: !readOnly && !plaintext
    }))));
  }
  const dataAttributes = {
    'data-list-type': listType,
    'data-draggable': draggable
  };
  if (plaintext) {
    return /*#__PURE__*/React.createElement(Plaintext, _extends({
      localeKey: "notUploaded",
      className: classes
    }, dataAttributes), fileList.current.length ? renderList[1] : null);
  }
  if (listType === 'picture') {
    renderList.reverse();
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: rootRef,
    className: classes,
    style: style
  }, dataAttributes), renderList);
});
Uploader.displayName = 'Uploader';
export default Uploader;