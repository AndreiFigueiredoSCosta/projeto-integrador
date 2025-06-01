import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function CotacaoCotacaoFornecedorHeader(){
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={1}>
                Nome fantasia
            </HeaderPiece>
        </TableHeader>
    );
}
