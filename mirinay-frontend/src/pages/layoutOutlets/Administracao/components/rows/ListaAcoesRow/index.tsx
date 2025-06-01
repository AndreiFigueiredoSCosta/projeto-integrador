import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";

import { Checkbox } from "../../../../../../components/form/misc/Checkbox";
import ListaAcaoAutorizacaoResponseData
    from "../../../../../../models/administracao/ListaAcaoAutorizacaoResponseData.ts";

interface AcoesRowProps {
    data: ListaAcaoAutorizacaoResponseData;
    stripped: boolean;
    handleSelect: (data: ListaAcaoAutorizacaoResponseData) => void;
    selectedItens?: number[];
}

/**
 * Linha de exibição de listagem de pedidos
 * @constructor
 */
export default function ListaAcoesRow({ data,  handleSelect, selectedItens } : AcoesRowProps) {


    return (
        <TableRow>
            <RowPiece size={1}>
                <Checkbox size="medium" checked={selectedItens?.includes(data.id)}
                          onClick={()=>handleSelect(data)}/>
            </RowPiece>
            <RowPiece size={4}>
                {data.acao}
            </RowPiece>
            <RowPiece size={4}>
                {data.endpoint}
            </RowPiece>
            <RowPiece size={4}>
                {data.metodoHttp}
            </RowPiece>
        </TableRow>
    );
}
