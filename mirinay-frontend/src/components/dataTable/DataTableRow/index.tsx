import {ReactNode} from "react";

import "./style.css";

type DataTableRowProps = {
    children?: ReactNode,
    size?: 1 | 2 | 3
}

export default function DataTableRow ({
                           children,
                           size = 1 }
                           : DataTableRowProps){
    return (
        <div className={`data-table-row data-table-row-${size}`}>
            {children}
        </div>
    );
}
