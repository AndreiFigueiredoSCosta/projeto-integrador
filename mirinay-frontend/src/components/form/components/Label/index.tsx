import "./style.css"
import React from "react";

type PropsType = {
    htmlFor: string,
    elementFilled: boolean,
    children?: React.ReactNode,
    disabled?: undefined | boolean,
}

/**
 * Componente de Label
 * @param htmlFor - string - codigo do elemento que o label está associado
 * @param elementFilled - boolean - se o elemento está preenchido
 * @param children - React.ReactNode - conteúdo do label
 * @param disabled - boolean - se o label está desabilitado
 * @constructor
 */
export function Label({htmlFor, elementFilled = false, children, disabled}: PropsType) {
    return (
        <label htmlFor={htmlFor} className={`label ${elementFilled && 'element-filled'} ${disabled && 'disabled-label'}`}>
            {children}
        </label>
    )
}
