import './style.css';
import {ReactNode} from "react";
import {P} from "../../text/P";
import {Checkbox} from "../../form/misc/Checkbox";

interface KanbanItemPieceProps {
    variant?: "text" | "centered-text" | "checkbox";
    hasLeftDivider?: boolean;
    hasRightDivider?: boolean;
    children?: ReactNode;
    handleCheckboxChange?: () => void;
    resetCheck?: boolean;
}

export default function KanbanItemPiece({
                                            variant = "text",
                                            children,
                                            hasRightDivider = false,
                                            hasLeftDivider = false,
                                            handleCheckboxChange= () => {},
                                            resetCheck = false}
                                            : KanbanItemPieceProps) {

    return (
        <>
            {hasLeftDivider &&
                <div className={`kanban-item-piece-divider`}/>
            }
        <div
            className={`kanban-item-piece`}
            style={{
                width: variant === "text" ? "100%" : "fit-content",
                overflowY: variant === "text" ? "auto" : "visible",
                alignItems: variant === "text" && children && children.valueOf().toString().length > 50 ?
                    "flex-start"
                    : "center"
            }}
        >
            {
                variant === "checkbox" ?
                <Checkbox size={"large"} onClick={handleCheckboxChange} resetCheck={resetCheck} />
                :
                <P
                    variant={"medium"}
                    color={"blank"}
                    uppercase={true}
                    align={"middle"}
                    justify={variant === "centered-text" ? "center" : "left"}
                    style={{
                        fontWeight: 600,
                        padding: "0 5px"
                    }}
                >
                    {children}
                </P>
            }
        </div>
            {hasRightDivider &&
                <div className={`kanban-item-piece-divider`}/>
            }

        </>
    );
}
