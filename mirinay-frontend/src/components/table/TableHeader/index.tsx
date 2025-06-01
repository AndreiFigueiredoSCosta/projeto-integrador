import './styles.css'

type TableHeaderProps = {
    children?: React.ReactNode;
    dropdown?: boolean;
};

/**
 * Componente TableHeader
 * @param children - Conteúdo do TableHeader
 * @param variant - variante específica do tableHeader, default ou dropdown
 */
export function TableHeader({ children, dropdown }: TableHeaderProps) {
    return (
        <div className={`tableHeader ${dropdown && 'dropdown-tableHeader'}`}>
            {children}
        </div>
    );
}
