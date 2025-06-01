import {HeaderPiece} from "../../../../../../../../../../components/table/components/HeaderPiece";
import {TableHeader} from "../../../../../../../../../../components/table/TableHeader";


/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function CotacaoCotacaoCotacaoHeader(){
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={3}>
                Nome do Produto
            </HeaderPiece>

            <HeaderPiece size={1}>
                Quantidade
            </HeaderPiece>

            <HeaderPiece size={3}>
                Ultima Cotação
            </HeaderPiece>

            <HeaderPiece size={4}/>
        </TableHeader>
    );
}
