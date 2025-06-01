import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import SimilarResponseData from "../../../../../../models/produto/response/SimilarResponseData.ts";
import IconButton from "../../../../../../components/misc/IconButton";

interface SimilarRowProps {
    data: SimilarResponseData;
    stripped: boolean;
    deleteFunction: (data: SimilarResponseData) => void;
    editFunction: (data: SimilarResponseData) => void;
}

/**
 * Linha de exibição de similares
 * @constructor
 */
export default function ProdutoSimilarDetailsRow({ data, stripped, editFunction, deleteFunction } : SimilarRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={3}>
                {data.codigoReferencia}
            </RowPiece>
            <RowPiece size={3}>
                {data.marca ?? "-"}
            </RowPiece>
            <RowPiece size={4} textSize={"small"}>
                {data.observacao}
            </RowPiece>
            <RowPiece size={2}>
                <div style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "end",
                    gap: "10px"
                }}>
                    <IconButton
                        variant={"edit"}
                        onClick={() => {
                            editFunction(data);
                        }}
                        size={"small"} />
                    <IconButton
                        variant={"delete"}
                        onClick={() => {
                            deleteFunction(data);
                        }}
                        size={"small"} />
                </div>
            </RowPiece>
        </TableRow>
    );
}
