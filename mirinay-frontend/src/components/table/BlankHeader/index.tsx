import './styles.css'
import {CSSProperties, ReactNode} from "react";

type FunctionHeaderProps = {
     children?: ReactNode;
     style?: CSSProperties;
};

/**
 * Componente
 * @param children - Conteúdo do FunctionHeader
 * @param style - Estilo do FunctionHeader
 */


export function BlankHeader({ children, style }: FunctionHeaderProps) {

    return (
        <div className={`blank-header`} style={style}>
        { children }
        </div>
    );
}
