import {memo} from "react";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import {UnidadeResponseData} from "../../../summary/tables/UnidadeTable";

interface UnidadeRowProps {
    data: UnidadeResponseData,
    handleClick: (type: string, data: UnidadeResponseData) => void,
    stripped: boolean
}

/**
 * Linha de exibição de unidade
 */
const UnidadeRow = memo( function UnidadeRow ({ data, stripped, handleClick } : UnidadeRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={1}>
                {data.sigla}
            </RowPiece>
            <RowPiece size={9}>
                {data.nome}
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

export default UnidadeRow;

