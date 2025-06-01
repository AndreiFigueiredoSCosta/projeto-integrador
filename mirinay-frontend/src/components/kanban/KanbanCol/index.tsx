import {ReactNode, FC, useRef, useEffect} from 'react';
import './style.css';
import {P} from "../../text/P";
import getRandomHexColor from "../../../utils/getRandomHexColor.ts";

interface KanbanColumnProps {
  title: string;
  headerContent?: ReactNode;
  children?: ReactNode;
  color?: "gray" | "green" | "red" | "alt-green" | "black" | "yellow" | "random";
}

const KanbanColumn: FC<KanbanColumnProps> = ({ title, headerContent, children, color = "gray" }) => {
    const randomColorRef = useRef("");
    useEffect(() => {
        if (color === "random") {
            randomColorRef.current = `${getRandomHexColor()}66`;
        }
    }, []);

    // background-image: linear-gradient(var(--verde-80-transparente), var(--verde-80-transparente));
    return (
        <div className="kanban-column">
            <div className={`kanban-column-title kanban-column-title-${color}`}
                 style={
                     color === "random" ?
                         {backgroundImage: `linear-gradient(${randomColorRef.current}, ${randomColorRef.current})`}
                         : {}
                 }
            >
                <P
                    uppercase={true}
                    justify={"center"} bold={true}
                    variant={"xxlarge"}
                    color={"white"}
                    align={"middle"}
                >
                    {title}
                </P>
            </div>

            <div className="kanban-column-header">
                {headerContent}
            </div>

            <div className="kanban-column-content">
                {children}
            </div>
        </div>
    );
};

export default KanbanColumn;
