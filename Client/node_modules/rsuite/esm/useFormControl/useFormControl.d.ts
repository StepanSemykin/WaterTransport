import React from 'react';
import type { CheckType } from 'schema-typed';
import type { CheckTriggerType } from '../internals/types';
export interface UseFormControlProps {
    /** The name of form field */
    name: string;
    /** The current value (controlled) */
    value?: any;
    /** The data validation trigger type */
    checkTrigger?: CheckTriggerType;
    /** Show error messages */
    errorMessage?: React.ReactNode;
    /** Asynchronous check value */
    checkAsync?: boolean;
    /** Remove field value and error message when component is unmounted */
    shouldResetWithUnmount?: boolean;
    /** Validation rule */
    rule?: CheckType<unknown, any>;
}
/**
 * Hook for accessing form control functionality.
 * Must be used within a Form component.
 *
 * @param props The form control properties
 * @returns Form control functionality for the specified field
 */
export declare function useFormControl(props: UseFormControlProps): {
    value: any;
    error: React.ReactNode;
    plaintext: boolean | undefined;
    readOnly: boolean | undefined;
    disabled: boolean | undefined;
    onChange: (...args: any[]) => any;
    onCheck: (...args: any[]) => any;
    onBlur: (...args: any[]) => any;
    setValue: (value: any, shouldValidate?: boolean) => void;
};
export default useFormControl;
