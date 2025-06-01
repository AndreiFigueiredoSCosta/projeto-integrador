import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";
import IconButton from "../../../../../../../../components/misc/IconButton";
import idConversor from "../../../../../../../../utils/idConversor.ts";
import CotacaoRevisaoFornecedorResponseData
    from "../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoFornecedorResponseData.ts";

interface ClonagemFornecedorRowProps {
    data: CotacaoRevisaoFornecedorResponseData;
    stripped: boolean;
    handleDelete: (data:CotacaoRevisaoFornecedorResponseData) => void;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoFornecedorRow({
                                                     data,
                                                     stripped,
                                                     handleDelete }
                                                     : ClonagemFornecedorRowProps){
    return (
        <TableRow
            stripped={stripped}
        >
            <RowPiece size={4}>
                {idConversor(data.fornecedorId)} - {data.nomeFantasia}
            </RowPiece>
            <RowPiece size={3}>
                {data.cnpj}
            </RowPiece>
            <RowPiece size={4} textSize={"small"}>
                {data.observacoes}
            </RowPiece>
            <RowPiece size={1}>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px"
                }}>
                    <IconButton size={"small"} variant={"delete"} onClick={() => handleDelete(data)}/>
                </div>
            </RowPiece>
        </TableRow>
    );
}
