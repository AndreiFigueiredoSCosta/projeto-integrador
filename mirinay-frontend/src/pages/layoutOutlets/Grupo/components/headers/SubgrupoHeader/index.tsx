import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de subgrupos
 * @constructor
 */
export default function SubgrupoHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={4}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={8}>
                Descrição
            </HeaderPiece>
        </TableHeader>
    );
}
