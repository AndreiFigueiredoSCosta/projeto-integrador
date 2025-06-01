import './style.css'
import * as React from "react";
import {P} from "../../../../text/P";

type badgeProps = {
    variant: 'success' | 'danger' | 'warning';
    uppercase?: boolean;
    children?: React.ReactNode,
    style?: React.CSSProperties
};

/**
 * Componente usado para destacar status atual de algo
 * @param children - Conteúdo do badge
 * @param variant (success, danger, warning) -  A variante da badge. Controla a cor e o estilo do badge
 * @param uppercase - Se o texto do badge deve ser em caixa alta
 * @param style - Estilo customizado do badge
 */
export function StatusBadge({ variant, children, uppercase, style }: badgeProps) {

    const colors: { [key: string]: 'green' | 'yellow' | 'red' } = {
        success: 'green',
        warning: 'yellow',
        danger: 'red',
    };

    const chosenColor: 'green' | 'yellow' | 'red' = colors[variant]

    return (
        <div className={`badge ${variant}-badge`} style={style}>
            <P
                bold={true}
                children={children}
                color={chosenColor}
                align={"middle"}
                justify={"center"}
                uppercase={uppercase}
            />
        </div>
    )
}
