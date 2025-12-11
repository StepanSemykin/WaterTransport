'use client';
import { SchemaModel } from 'schema-typed';
import { useRef, useCallback } from 'react';
import { constructFlatSchema } from "../utils/constructFlatSchema.js";
function useSchemaModel(formModel, nestedField) {
  const subRulesRef = useRef([]);
  const pushFieldRule = useCallback((name, fieldRule) => {
    subRulesRef.current.push({
      name,
      fieldRule
    });
  }, []);
  const removeFieldRule = useCallback(name => {
    const index = subRulesRef.current.findIndex(v => v.name === name);
    subRulesRef.current.splice(index, 1);
  }, []);
  const getCombinedModel = useCallback(() => {
    const realSubRules = subRulesRef.current.filter(v => Boolean(v.fieldRule.current));

    // If there is no sub rule, return the original form model
    if (realSubRules.length === 0) {
      return formModel;
    }
    const subRuleObject = realSubRules.map(({
      name,
      fieldRule
    }) => ({
      [name]: fieldRule.current
    })).reduce((a, b) => Object.assign(a, b), {});
    return SchemaModel.combine(formModel, SchemaModel(nestedField ? constructFlatSchema(subRuleObject) : subRuleObject));
  }, [formModel, nestedField]);
  return {
    getCombinedModel,
    pushFieldRule,
    removeFieldRule
  };
}
export default useSchemaModel;