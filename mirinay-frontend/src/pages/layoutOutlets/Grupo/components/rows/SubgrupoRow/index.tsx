import SubgrupoResponseData from "../../../../../../models/grupo/response/SubgrupoResponseData.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import idConversor from "../../../../../../utils/idConversor.ts";

interface SubgrupoRowProps {
    data: SubgrupoResponseData;
    stripped: boolean;
}

/**
 * Linha de exibição de subgrupos
 * @constructor
 */
export default function SubgrupoRow({ data, stripped } : SubgrupoRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={4}>
                {idConversor(data.subgrupoId)} - {data.nome}
            </RowPiece>
            <RowPiece size={8}>
                {data.descricao}
            </RowPiece>
        </TableRow>
    );
}
