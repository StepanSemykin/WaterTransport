import React from 'react';
export interface CheckboxGroupContextValue {
    inline?: boolean;
    name?: string;
    value?: (string | number)[];
    controlled?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    plaintext?: boolean;
    onChange?: (value: any, checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare const CheckboxGroupContext: React.Context<CheckboxGroupContextValue | undefined>;
