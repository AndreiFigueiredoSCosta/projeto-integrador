import './style.css';
import {ReactNode} from "react";

export default function DetailsContainer({children}: {children: ReactNode}) {
    return (
        <div className={"details-container"}>
            {children}
        </div>
    );
}
