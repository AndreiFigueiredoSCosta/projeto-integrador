import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de similares de um produto de uma clonagem
 * @constructor
 */
export default function ClonagemSimilarHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={10}>
                Referência
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
