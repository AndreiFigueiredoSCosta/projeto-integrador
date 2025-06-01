import {ReactNode} from "react";
import {Bar} from "../../table/components/Bar";

import "./style.css";

type DataTableContainerProps = {
    children?: ReactNode,
    rowsNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

export default function DataTableContainer ({
                                 children,
                                 rowsNumber }
                                 : DataTableContainerProps ){
    return (
        <div className={`data-table-container`}>
            <Bar variant={"upper"} size={"small"}/>
            <div className={`data-table-content`} style={{
                minHeight: `${rowsNumber * 30}px`,
                maxHeight: `${rowsNumber * 60}px`
            }}>
                {children}
            </div>
            <Bar variant={"lower"} size={"small"}/>
        </div>
    );
}
