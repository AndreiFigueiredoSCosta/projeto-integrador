import {CSSProperties, ReactNode, useEffect, useState} from "react";
import {P} from "../../text/P";

import "./style.css";

type DataTableCellProps = {
    children?: ReactNode,
    title?: string,
    contentTextSize?: "small" | "medium" | "large",
    type?: "blank" | "text",
    style?: CSSProperties
}

export default function DataTableCell ({
                            children,
                            title,
                            contentTextSize = "medium",
                            style,
                            type = "text"}
                            : DataTableCellProps){
    const [ content, setContent ] = useState<ReactNode>(null);

    // Altera o conteúdo do componente de acordo com o tipo
    useEffect(() => {
        switch (type){
            case "blank":
                setContent(
                    <div className={`data-table-cell-content`}>
                        {children}
                    </div>
                );
                break;
            case "text":
                setContent(
                    <div className={`data-table-cell-content`}>
                        <P color={"black"} variant={contentTextSize} uppercase={true}>
                            {children}
                        </P>
                    </div>
                );
                break;
        }
    }, [children, contentTextSize, type]);

    return (
        <div className={`data-table-cell`} style={style}>
            {title &&
                <div className={`data-table-cell-title`}>
                    <P color={"black"} variant={"medium"} uppercase={true} bold={true}>
                        {title}
                    </P>
                </div>
            }
            {content}
        </div>
    );
}
