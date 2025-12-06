'use client';
import { useContext } from 'react';
import { useUniqueId } from "../internals/hooks/index.js";
import { FormGroupContext } from "./FormGroupContext.js";
export const useFormGroup = controlId => {
  const context = useContext(FormGroupContext);
  const fallbackId = useUniqueId('rs-');
  const id = controlId || context.controlId || fallbackId;
  const helpTextId = `${id}-help-text`;
  const labelId = `${id}-label`;
  const errorMessageId = `${id}-error-message`;
  return {
    /**
     * The `id` of the `<Form.Control>` component.
     */
    controlId: id,
    /**
     * The `id` of the `<Form.HelpText>` component.
     */
    helpTextId,
    /**
     * The `id` of the `<Form.ControlLabel>` component.
     */
    labelId,
    /**
     * The `id` of the `<Form.ErrorMessage>` component.
     */
    errorMessageId
  };
};