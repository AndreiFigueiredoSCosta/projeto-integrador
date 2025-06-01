import ProdutoRequisicaoResponseData from "../../../../../../models/requisicao/ProdutosRequisicaoResponseData";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import IconButton from "../../../../../../components/misc/IconButton";
import "./style.css";


interface ProdutoRequisicaoRowProps {
    data: ProdutoRequisicaoResponseData;
    stripped: boolean;
}

/**
 * Linha de exibição de detalhes de requisicao
 * @constructor
 */
export default function ProdutoRequisicaoRow({ data, stripped } : ProdutoRequisicaoRowProps){
    return (
        <TableRow stripped={stripped}>
            <RowPiece size={3}>
                {data.referencia}
            </RowPiece>
            <RowPiece size={3}>
                {data.quantidade}
            </RowPiece>
            <RowPiece size={4}>
                {data.observacao}
            </RowPiece>
            <RowPiece size={2}>
                <div className="sider">
                <IconButton size={"small"} variant={"edit"} onClick={ () => {}}/>
                <IconButton size={"small"} variant={"delete"} onClick={ () => {}}/>
                </div>
            </RowPiece>
        </TableRow>
    );
}
