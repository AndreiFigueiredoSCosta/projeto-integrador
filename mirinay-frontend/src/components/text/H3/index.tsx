import './style.css'
import * as React from "react";

/**
 * Componente usado em seções inferiores de uma página (Ex: small trade view e colunas de kanban)
 */
export function H3 ({ children, color = "black" } : { children? : React.ReactNode; color?: string } )
{
    const validColors = ["black", "white"];
    if (!validColors.includes(color))
    {
        console.error(`Invalid color: ${color}`);
        color = "black";
    }

    return (
        <h1 className={`h3 semi-bold uppercase ${color}`}>{ children }</h1>
    )
}
