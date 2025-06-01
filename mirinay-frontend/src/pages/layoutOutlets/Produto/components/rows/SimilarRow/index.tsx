import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import SimilarResponseData from "../../../../../../models/produto/response/SimilarResponseData.ts";

interface SimilarRowProps {
    data: SimilarResponseData;
    stripped: boolean;
    selected?: boolean;
}

/**
 * Linha de exibição de similares
 * @constructor
 */
export default function SimilarRow({ data, stripped, selected = false } : SimilarRowProps){
    return (
        <TableRow stripped={stripped} selected={selected}>
            <RowPiece size={4} selected={selected}>
                {data.codigoReferencia}
            </RowPiece>
            <RowPiece size={4} selected={selected}>
                {data.marca}
            </RowPiece>
            <RowPiece size={4} selected={selected}>
                --- EM PRODUÇÃO ---
            </RowPiece>
        </TableRow>
    );
}
