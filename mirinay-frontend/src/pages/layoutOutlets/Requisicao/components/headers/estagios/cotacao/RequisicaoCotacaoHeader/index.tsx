import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function RequisicaoCotacaoHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={3}>
                Referência
            </HeaderPiece>
            <HeaderPiece size={1}>
                Quantidade
            </HeaderPiece>
            <HeaderPiece size={4}>
                Observação
            </HeaderPiece>
            <HeaderPiece size={3}>
                Estagio
            </HeaderPiece>
            <HeaderPiece size={1}>
            </HeaderPiece>
        </TableHeader>
    );
}
