import './styles.css'

type HeaderPieceProps = {
    children?: React.ReactNode;
    onClick?: () => void;
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
};

/**
 * Componente HeaderPiece
 * @param children - Conteúdo do HeaderPiece
 * @param size - Tamanho que o HeaderPiece deve ocupar (1 a 12)
 * @param onClick - função chamada ao clicar no HeaderPiece
 * @param size - tamanho do headerPiece, de 1 a 12, para encaixar no TableHeader
 */
export function HeaderPiece({ children, onClick, size = 1 }: HeaderPieceProps) {
    return (
        <div className={`headerPiece headerPiece-${size} bold uppercase`} onClick={onClick}>
            {children}
        </div>
    );
}
