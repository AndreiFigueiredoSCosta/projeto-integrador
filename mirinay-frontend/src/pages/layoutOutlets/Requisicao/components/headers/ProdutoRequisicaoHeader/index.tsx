import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";
import { P } from "../../../../../../components/text/P";

/**
 * Cabeçalho da tabela de detalhes de requisicao
 * @constructor
 */
export default function ProdutoRequisicaoHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={3}>
                <P bold={true}>Referência do Produto</P>
            </HeaderPiece>
            <HeaderPiece size={3}>
                <P bold={true}>Quantidade</P>
            </HeaderPiece>
            <HeaderPiece size={4}>
                <P bold={true}>Observação</P>
            </HeaderPiece>
            <HeaderPiece size={2}>
                
            </HeaderPiece>
        </TableHeader>
    );
}
