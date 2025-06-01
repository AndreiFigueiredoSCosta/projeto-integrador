import { ReactNode, useState, FC } from 'react';
import './style.css';

interface KanbanItemProps {
    expansible?: boolean;
    expandedContent?: ReactNode;
    onClick?: () => void;
    children?: ReactNode;
}

/**
 * Componente de item do Kanban
 * @param expansible - Se o item é expansível
 * @param expandedContent - Conteúdo expandido
 * @param onClick - Função de clique
 * @param children - Filhos do componente
 * @constructor
 */
const KanbanItem: FC<KanbanItemProps> = ({
                                                   expansible = false,
                                                   expandedContent,
                                                   onClick = () => null,
                                                   children
                                               }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div className={`kanban-item-container`}>
            <div
                className={`kanban-Item  ${isExpanded ? 'kanban-item-expanded' : ''}`}
                onClick={!expansible ? undefined : () => {
                    onClick();
                    setIsExpanded((prev) => {
                        return !prev;
                    });
                }}
            >
                {children}
            </div>

            {/* Expansão do KanbanRow */}
            {isExpanded && expansible && (
                <div className="kanban-item-expansion">
                    {expandedContent}
                </div>
            )}
        </div>
    );
};

export default KanbanItem;
