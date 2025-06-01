import './styles.css'
import {CSSProperties} from "react";


type RowPieceProps = {
    children?: React.ReactNode;
    onClick?: () => void;
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    textSize?: "small" | "medium" | "large";
    selected?: boolean;
    style?: CSSProperties;
};

/**
 * Componente RowPiece
 * @param children - Conteúdo do RowPiece
 * @param size - Tamanho que o RowPiece deve ocupar (1 a 12)
 * @param onClick - função a ser realizada ao clicar no RowPiece
 * @param textSize - Tamanho do texto (small, medium, large)
 * @param selected - Se o RowPiece está selecionado
 */
export function RowPiece({ children, onClick, size = 1, textSize = "medium", selected = false, style }: RowPieceProps) {
    return (
        <div className={`rowPiece
        rowPiece-${size}
        regular
        rowPiece-text-${textSize}
        ${selected && 'row-piece-selected'}
        `} onClick={onClick} style={style}>
            {children}
        </div>
    );
}
