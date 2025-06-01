import CotacaoRevisaoProdutoFornecedorResponseData
    from "../../../../../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoFornecedorResponseData.ts";
import {TableRow} from "../../../../../../../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../../../../../../../components/misc/IconButton";

interface ClonagemFornecedorRowProps {
    data: CotacaoRevisaoProdutoFornecedorResponseData;
    stripped: boolean;
    handleEdit: () => void;
    handleDelete: () => void;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoProdutoFornecedorRow({
                                                     data,
                                                     stripped,
                                                     handleEdit,
                                                     handleDelete }
                                                     : ClonagemFornecedorRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={4}>
                {data.nomeFornecedor}
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
                    <IconButton size={"small"} variant={"edit"} onClick={handleEdit}/>
                    <IconButton size={"small"} variant={"delete"} onClick={handleDelete}/>
                </div>
            </RowPiece>
        </TableRow>
    );
}
