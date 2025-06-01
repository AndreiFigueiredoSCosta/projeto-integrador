import SubgrupoResponseData from "../../../../../../models/grupo/response/SubgrupoResponseData.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import idConversor from "../../../../../../utils/idConversor.ts";

interface SubgrupoRowProps {
    data: SubgrupoResponseData;
    stripped: boolean;
    editFunction: () => void;
    deleteFunction: () => void;
}

/**
 * Linha de exibição de subgrupos dos detalhes de um grupo
 * @constructor
 */
export default function SubgrupoDetailsRow({ data, stripped, editFunction, deleteFunction } : SubgrupoRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={4}>
                {idConversor(data.subgrupoId)} - {data.nome}
            </RowPiece>
            <RowPiece size={6}>
                {data.descricao}
            </RowPiece>
            <RowPiece size={2}>
                <div style={{
                    display: "flex",
                    gap: "10px",
                    alignContent: "center",
                    justifyContent: "end",
                    padding: "0 10px"
                }}>
                    <IconButton size={"small"} variant={"edit"} onClick={editFunction}/>
                    <IconButton size={"small"} variant={"delete"} onClick={deleteFunction}/>
                </div>
            </RowPiece>
        </TableRow>
    );
}
