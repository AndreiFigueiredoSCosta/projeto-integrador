import {memo} from "react";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import {MarcaResponseData} from "../../../summary/tables/MarcaTable";
import idConversor from "../../../../../../utils/idConversor.ts";

interface MarcaRowProps {
    data: MarcaResponseData,
    handleClick: (type: string, data: MarcaResponseData) => void,
    stripped: boolean
}

/**
 * Linha de exibição de marca
 */
const MarcaRow = memo( function MarcaRow ({ data, stripped, handleClick } : MarcaRowProps){
    console.log("MarcaRow", data);
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={10}>
                {idConversor(data.id)} - {data.nome}
            </RowPiece>
            <RowPiece size={2}>
                <div style={
                    {
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "10px"
                    }
                }>
                    <IconButton variant={"edit"} onClick={() => handleClick('edit', data)} size={"small"}/>
                    <IconButton variant={"delete"} onClick={() => handleClick('delete', data)} size={"small"}/>
                </div>
            </RowPiece>
        </TableRow>
    );
});

export default MarcaRow;

