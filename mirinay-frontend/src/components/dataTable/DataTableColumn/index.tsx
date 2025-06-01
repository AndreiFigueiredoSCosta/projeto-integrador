import {ReactNode} from "react";
import "./style.css";

type DataTableColumnProps = {
    children?: ReactNode,
    size?: 1 | 2 | 3
}

export default function DataTableColumn ({
                              children,
                              size = 1}
                              : DataTableColumnProps){
    return (
        <div className={`data-table-col data-table-col-${size}`}>
            {children}
        </div>
    );
}
