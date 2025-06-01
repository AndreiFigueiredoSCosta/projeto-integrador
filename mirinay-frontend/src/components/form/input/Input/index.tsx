import '../../style/style.css';
import './style.css';
import React, { useState, useEffect, useCallback } from "react";
import { Label } from "../../components/Label";
import { RequiredElement } from "../../components/RequiredElement";

type Props = {
    type: "text" | "password" | "search" | "email" | "number" | "tel" | "url" | "hidden" | "cpf" | "cnpj" | "date";
    label: string;
    name: string;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    autoComplete?: boolean;
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    step?: number;
    onEnterClick?: () => void;
};

// Máscara para CPF
function applyCpfMask(value: string) {
    return value
        .replace(/\D/g, '')           // Remove tudo que não for dígito
        .slice(0, 11)                 // Limita a 11 dígitos
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}


// Máscara para CNPJ
function applyCnpjMask(value: string) {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

// Máscara para Data (dd/mm/yyyy)
function applyDateMask(value: string) {
    return value
        .replace(/\D/g, '') // Remove não dígitos
        .replace(/(\d{2})(\d)/, '$1/$2') // Dia/Mês
        .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3') // Dia/Mês/Ano
        .substring(0, 10); // Limita a 10 caracteres
}

export default function Input({
    type,
    label,
    name,
    value = "",
    onChange,
    max = 999999999,
    min = 0,
    step,
    maxLength = 256,
    minLength = 3,
    required = false,
    autoComplete = false,
    onEnterClick = () => {},
    disabled = false
}: Props) {
    const [currentValue, setCurrentValue] = useState(value || '');

    useEffect(() => {
        setCurrentValue(value || '');
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        // Aplica máscaras manuais conforme o tipo
        if (type === "cpf") {
            inputValue = applyCpfMask(inputValue);
        } else if (type === "cnpj") {
            inputValue = applyCnpjMask(inputValue);
        } else if (type === "date") {
            inputValue = applyDateMask(inputValue);
        }

        setCurrentValue(inputValue);
        if (onChange) {
            onChange(inputValue);
        }
    }, [onChange, type]);

    const handleReset = () => {
        setCurrentValue("");
    }

    return (
        <div className="form-element"
             style={{ display: type === "hidden" ? "none" : "block" }}
        >
            <input
                id={name + "ID"}
                name={name}
                className={`input ${type === "search" ? "search-input" : ""}`}
                type={["cpf", "cnpj", "date"].includes(type) ? "text" : type}
                value={currentValue}
                onChange={handleChange}
                disabled={disabled}
                onReset={handleReset}
                autoComplete={autoComplete ? "on" : "off"}
                required={required}
                min={min}
                max={max}
                minLength={minLength}
                maxLength={maxLength}
                step={step}
                aria-required={required}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onEnterClick();
                    }
                }}
            />
            {
                type !== "hidden" && (
                    <Label htmlFor={name + "ID"} elementFilled={!!currentValue} disabled={disabled}>
                        <RequiredElement isRequired={required} /> {label}
                    </Label>
                )
            }
        </div>
    );
}
