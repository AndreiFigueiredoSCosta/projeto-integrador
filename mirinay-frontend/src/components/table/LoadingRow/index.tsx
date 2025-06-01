import React from "react";
import randomKey from "../../../utils/randomKey.ts";
import {TableRow} from "../TableRow";
import {Loading} from "../../misc/Loading";

                //TODO: Refazer parte do loading

/**
 * Componente de linha enquanto está carregando
 * @param stripped - Define se a linha é mais escura ou não
 * @constructor
 */
export default function LoadingRow({stripped = false} : {stripped?: boolean}){
    return (
        <React.Fragment key={randomKey()}>
            <TableRow stripped={stripped}>
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
            </TableRow>
        </React.Fragment>
    );
}
