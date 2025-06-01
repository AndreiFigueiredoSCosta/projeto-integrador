import './style.css'
import * as React from "react";
import { H2 } from '../../text/H2';
import { H3 } from '../../text/H3';
import { P } from '../../text/P';

type ViewTraderProps = {
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    size?: 'large' | 'small' | 'medium';
};

/**
 * Componente usado para troca de visão de um conteúdo para outro
 * @param children - Conteúdo do viewTrader
 * @param size - (large, small, medium) - Varia o tamanho do viewTrader
 * @param onClick - Função a ser realizada ao clicar no viewTrader
 * @param disabled - Define se o viewTrader está selecionado ou não
 */
export function ViewTrader({ onClick, disabled = false, children, size = "medium"}: ViewTraderProps) {
    const Sizing = size === 'large'
        ? H2
        : size === 'medium'
        ? H3
        : P;

    return (
        <button type={"button"} onClick={onClick} className={`trader ${disabled} ${size}`} disabled={!disabled} >
            <Sizing bold={true} justify={"center"}>
                {children}
            </Sizing>
        </button>
    )
}
