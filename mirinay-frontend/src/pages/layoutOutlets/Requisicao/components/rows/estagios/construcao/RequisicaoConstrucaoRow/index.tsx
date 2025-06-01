import RequisicaoConstrucaoResponseData
    from "../../../../../../../../models/requisicao/construcao/RequisicaoConstrucaoResponseData.ts";
import {RowPiece} from "../../../../../../../../components/table/components/RowPiece";
import {TableRow} from "../../../../../../../../components/table/TableRow";
import IconButton from "../../../../../../../../components/misc/IconButton";

interface ClonagemFornecedorRowProps {
    data: RequisicaoConstrucaoResponseData;
    stripped: boolean;
    handleEdit: (data:RequisicaoConstrucaoResponseData) => void;
    handleDelete: (data:RequisicaoConstrucaoResponseData) => void;
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function RequisicaoConstrucaoRow({
                                                  data,
                                                  stripped,
                                                  handleEdit,
                                                  handleDelete }
                                                  : ClonagemFornecedorRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={4}>
                {data.referencia}
            </RowPiece>
            <RowPiece size={2} textSize={"large"}>
                {data.quantidade}
            </RowPiece>
            <RowPiece size={5} textSize={"small"}>
                {data.observacao}
            </RowPiece>
            <RowPiece size={1}>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    gap: "10px"
                }}>
                    <IconButton size={"small"} variant={"edit"} onClick={() => handleEdit(data)}/>
                    <IconButton size={"small"} variant={"delete"} onClick={() => handleDelete(data)}/>
                </div>
            </RowPiece>
        </TableRow>
    );
}
