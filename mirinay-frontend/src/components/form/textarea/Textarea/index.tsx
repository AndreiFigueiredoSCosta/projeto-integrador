import React, {useCallback, useEffect, useState} from 'react';
import {Label} from "../../components/Label";

import './style.css'
import '../../style/style.css'
import {RequiredElement} from "../../components/RequiredElement";

type TextAreaProps = {
    label: string;
    name: string;
    value?: string;
    required: boolean;
    onChange?: (value: string) => void;
    disabled?: boolean;
    minLength?: number;
    maxLength?: number;
};

/**
 * Componente de Text Area
 * @param label - Label do Text Area
 * @param name - Nome do Text Area
 * @param value - Valor do Text Area
 * @param required - Se o Text Area é obrigatório
 * @param onChange - Função a ser realizada ao mudar o valor do Text Area
 * @param disabled - Se o Text Area está desabilitado
 * @constructor
 */
export function TextArea ({
                              label,
                              name,
                              value = "",
                              required,
                              onChange,
                              disabled = false,
                              minLength = 3,
                              maxLength = 255}
                              : TextAreaProps){

    const [currentValue, setCurrentValue] = useState(value);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    }, [onChange]);

    return (
        <div className="form-element">
            <textarea className={`input TextAreaBody`}
                      id={`${name}ID`}
                      name={name}
                      value={currentValue}
                      disabled={disabled}
                      required={required}
                      onChange={handleChange}
                      minLength={minLength}
                      maxLength={maxLength}
            />
            <Label htmlFor={`${name}ID`} disabled={disabled} elementFilled={!!currentValue}>
                <RequiredElement isRequired={required}/>{label}
            </Label>
        </div>

    );


}
