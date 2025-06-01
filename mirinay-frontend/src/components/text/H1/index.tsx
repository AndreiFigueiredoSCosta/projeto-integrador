import './style.css'
import * as React from "react";

/**
 * Componente usado no título principal de uma página
 */
export function H1 ({ children } : { children? : React.ReactNode } )
{
    return (
        <h1 className={`h1 semi-bold capitalize`}>{ children }</h1>
    )
}
