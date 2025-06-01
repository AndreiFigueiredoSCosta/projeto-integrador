import {HeaderPiece} from "../../../../../../../../../../../../components/table/components/HeaderPiece";
import {TableHeader} from "../../../../../../../../../../../../components/table/TableHeader";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoProdutoFornecedorHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={4}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={3}>
                CNPJ
            </HeaderPiece>
            <HeaderPiece size={4}>
                Observação
            </HeaderPiece>
            <HeaderPiece size={1}>
            </HeaderPiece>
        </TableHeader>
    );
}
