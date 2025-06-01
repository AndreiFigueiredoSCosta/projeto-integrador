import {ReactNode} from "react";
import {P} from "../../text/P";

import "./style.css";

type KanbanExpandedItemRowProps = {
    title: string,
    children?: ReactNode,
    hasBottomDivider?: boolean
}

/**
 * Componente de linha expandida de um item do kanban
 * @param children Conteúdo da linha
 * @param title Título da linha
 * @constructor
 */
export default function KanbanExpandedItemRow({children, title, hasBottomDivider}: KanbanExpandedItemRowProps){
    return (
        <div className={`kanban-expanded-item-row-container`}>
            <div className={`kanban-expanded-item-row`}>
                <P
                    color={"black"}
                    align={"middle"}
                    justify={"right"}
                    uppercase={true}
                    bold={true}
                    variant={"small"}
                    style={{
                        width: "100px",
                    }}
                >
                    {title}
                </P>
                <div className={`kanban-expanded-item-row-divider`}/>
                <P
                    color={"black"}
                    align={"middle"}
                    justify={"left"}
                    uppercase={true}
                    variant={"small"}
                >
                    {children}
                </P>
            </div>
            {hasBottomDivider &&
                <div className={`kanban-expanded-item-row-bottom-divider`}/>
            }
        </div>

    );
}
