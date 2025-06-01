import {ReactNode} from "react";
import {P} from "../../../../text/P";
import "./style.css";

export default function PopupCard ({children, title}: {children: ReactNode, title: string}) {
    return (
        <div className={`popup-card`}>
            <div className={`popup-card-title`}>
                <P variant={"small"}
                   align={"middle"}
                   justify={"center"}
                   color={"white"}
                   uppercase={true}
                   bold={true}
                >
                    {title}
                </P>
            </div>
            <div className={`popup-card-content`}>
                {children}
            </div>
        </div>
    );
}
