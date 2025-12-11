'use client';
import { useState, useEffect, useMemo } from 'react';
import { shallowEqual } from "../../internals/utils/index.js";
function useData(props) {
  const {
    controlledData = [],
    cacheData = [],
    onChange
  } = props;
  const [uncontrolledData, setData] = useState(controlledData);
  const [newData, setNewData] = useState([]);
  const data = useMemo(() => {
    return [].concat(uncontrolledData, newData);
  }, [newData, uncontrolledData]);
  const dataWithCache = useMemo(() => {
    return [].concat(data, cacheData);
  }, [data, cacheData]);

  // Update the state when the data in props changes
  useEffect(() => {
    if (controlledData && !shallowEqual(controlledData, uncontrolledData)) {
      setData(controlledData);
      setNewData([]);
      onChange === null || onChange === void 0 || onChange(controlledData);
    }
  }, [controlledData, uncontrolledData, onChange]);
  return {
    data,
    dataWithCache,
    newData,
    setNewData
  };
}
export default useData;