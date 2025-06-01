import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoFornecedorHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={4}>
                Nome Fantasia
            </HeaderPiece>

            <HeaderPiece size={3}>
                CNPJ
            </HeaderPiece>

            <HeaderPiece size={4}>
                Observação
            </HeaderPiece>

            <HeaderPiece size={1}/>
        </TableHeader>
    );
}
