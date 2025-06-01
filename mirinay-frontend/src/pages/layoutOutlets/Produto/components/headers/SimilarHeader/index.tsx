import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de Similares
 * @constructor
 */
export default function SimilarHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={4}>
                Referência
            </HeaderPiece>
            <HeaderPiece size={4}>
                Marca
            </HeaderPiece>
            <HeaderPiece size={4}>
                Histórico
            </HeaderPiece>
        </TableHeader>
    );
}
