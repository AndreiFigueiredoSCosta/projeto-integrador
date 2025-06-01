import './style.css';
import {ReactNode} from "react";
import {H1} from "../../text/H1";

export default function SummaryContainer({children, title}: {children: ReactNode, title: string}) {
    return (
        <div className={"summary-container"}>
            <H1>{title}</H1>
            <div className={"summary-content"}>
                {children}
            </div>
        </div>
    );
}
