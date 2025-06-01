import React from "react";
import './style.css';
import {Loading} from "../../../misc/Loading";

type ActionButtonProps = {
    variant: 'submit' | 'details' | 'delete' | 'cancel';
    onClick?: (value: string) => void;
    disabled?: boolean;
    value?: string;
    type?: 'button' | 'submit' | 'reset';
    children?: React.ReactNode;
    size?: 'large' | 'small';
    upper?: boolean;
    style?: React.CSSProperties;
    hasLoading?: boolean;
}

/**
 * Componente de botão de ação
 * @param variant {'submit' | 'details' | 'delete' | 'cancel'} - A variante do botão, que controla a cor e o estilo do botão
 * @param onClick - Função a ser realizada ao clicar no botão
 * @param disabled - Define se o botão está desabilitado ou não
 * @param value - Valor do botão
 * @param type {'button' | 'submit' | 'reset'} - Tipo do botão
 * @param children - Conteúdo do botão
 * @param size {'large' | 'small'} - Tamanho do botão
 * @param upper - Define se o botão é do tipo superior ou não
 * @param style - Estilo customizado do botão
 * @param hasLoading - Define se o botão deve exibir um ícone de carregamento
 */
export function ActionButton({ variant,
                                 onClick,
                                 disabled = false,
                                 value = '',
                                 type = 'button',
                                 children,
                                 size = 'large',
                                 upper = false,
                                 style,
                                 hasLoading = false
                             }
                                 : ActionButtonProps) {
    return (
        <button
            className={`actionbutton ${variant}-actionbutton ${size}-actionbutton ${upper && 'upper-actionbutton'}`}
            onClick={(e) => onClick && onClick((e.target as HTMLButtonElement).value)}
            value={value}
            type={type}
            disabled={disabled}
            style={{...style}}
        >
            {
                hasLoading ?
                    <Loading />
                    :
                    children
            }
        </button>
    );
}
