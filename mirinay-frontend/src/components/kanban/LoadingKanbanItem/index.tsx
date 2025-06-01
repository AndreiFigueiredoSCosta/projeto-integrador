import React from "react";
import randomKey from "../../../utils/randomKey.ts";
import {Loading} from "../../misc/Loading";
import KanbanItem from "../KanbanItem";

                //TODO: Refazer parte do loading

/**
 * Componente de item de kanban enquanto está carregando
 * @constructor
 */
export default function LoadingKanbanItem(){
    return (
        <React.Fragment key={randomKey()}>
            <KanbanItem>
                <div style={
                    {
                        display:"flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%"
                    }}
                >
                    <Loading />
                </div>
            </KanbanItem>
        </React.Fragment>
    );
}
