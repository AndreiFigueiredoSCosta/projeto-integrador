import {ReactNode} from "react";

import './style.css';

export default function KanbanContainer( {children} : {children?: ReactNode} ) {
    return (
        <div className={"kanban-container"}>
            {children}
        </div>
    );
}
