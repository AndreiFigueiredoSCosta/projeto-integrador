import './style.css'
import * as React from "react";

/**
 * Componente usado em títulos de seção/view de uma página (Ex: título de uma página, título de uma seção)
 */
export function H2 ({ children } : { children? : React.ReactNode } )
{
    return (
        <h1 className={`h2 semi-bold uppercase`}>{ children }</h1>
    )
}
