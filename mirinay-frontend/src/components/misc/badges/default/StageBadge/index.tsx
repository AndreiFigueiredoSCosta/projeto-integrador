import './style.css';
import * as React from "react";

type StageBadgeProps = {
    variant: 'green' | 'yellow' | 'black' | 'red' | 'gray' | 'alt-green';
    outline?: boolean;
    children?: React.ReactNode;
};

/**
 * Componente usado para indicar o estágio atual de algo
 * @param variant - A variante da badge (green, yellow, black, red, gray, alt-green). Controla a cor e o estilo da badge.
 * @param outline - Se a badge deve ter estilo outline ou preenchido.
 * @param children - Conteúdo da badge.
 */

export function StageBadge({ variant, outline = false, children }: StageBadgeProps) {

    return (
        <div className={`stage-badge ${variant}-badge ${outline ? 'outline' : 'fill'}`}>
            <p> {children} </p>
        </div>
    );
}
