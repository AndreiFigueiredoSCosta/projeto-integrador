import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import ClonagemSimilarResponseData from "../../../../../../models/clonagem/response/ClonagemSimilarResponseData.ts";

interface ClonagemFornecedorRowProps {
    data: ClonagemSimilarResponseData;
    stripped: boolean;
    handleDelete: () => void;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function ClonagemSimilarRow({
                                                  data,
                                                  stripped,
                                                  handleDelete }
                                                  : ClonagemFornecedorRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={10}>
                {data.referencia}
            </RowPiece>
            <RowPiece size={1}>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                }}>
                    <IconButton size={"small"} variant={"delete"} onClick={handleDelete}/>
                </div>
            </RowPiece>
        </TableRow>
    );
}
