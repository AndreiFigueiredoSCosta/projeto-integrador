import {TableHeader} from "../../../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function RequisicaoConstrucaoHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={4}>
                Referência
            </HeaderPiece>
            <HeaderPiece size={2}>
                Quantidade
            </HeaderPiece>
            <HeaderPiece size={5}>
                Observação
            </HeaderPiece>
            <HeaderPiece size={1}>
            </HeaderPiece>
        </TableHeader>
    );
}
