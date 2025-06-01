import "../styles/textStyle.css"
import "./style.css";
import {CSSProperties, ReactNode} from "react";

type PropsType = {
    children? : ReactNode;
    uppercase? : boolean;
    style? : CSSProperties;
    bold? : boolean;
    italic? : boolean;
    variant? : "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
    color? : "black" | "white" | "green" | "yellow" | "red" | "blank" | "gray";
    justify? : "left" | "center" | "right" | "justify" | "blank";
    align? : "top" | "middle" | "bottom" | "blank";
}

/**
 * Componente usado em parágrafos de texto
 * @param children - Conteúdo do parágrafo
 * @param uppercase - Deixa o texto em caixa alta (boolean)
 * @param bold - Deixa o texto em negrito (boolean)
 * @param italic - Deixa o texto em itálico (boolean)
 * @param variant - Tamanho do texto (small[10px], medium[12px], large[14px], xlarge[16px], xxlarge[18px])
 * @param color - Cor do texto (black, white, green, yellow, red)
 * @param justify - Alinhamento horizontal do texto (left, center, right, justify)
 * @param align - Alinhamento vertical do texto (top, center, bottom)
 * @param style - Estilos customizados do componente
 * @constructor
 */
export function P ({ children,
                       uppercase = true,
                       bold = false,
                       italic = false,
                       variant = "medium",
                       color = "black",
                       justify = "left",
                       align = "top",
                       style = {}
                   }
                       : PropsType )
{

    return (
        <p
            className={`p p-${variant} ${bold ? "bold" : "regular"}
            ${italic && "italic"} ${color} ${uppercase && "uppercase"}
            align-${align} justify-${justify}`}
            style={style}
        >
            { children }
        </p>
    )
}
