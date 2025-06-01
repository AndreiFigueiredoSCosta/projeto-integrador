import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de subgrupos dos detalhes de um grupo
 * @constructor
 */
export default function SubgrupoDetailsHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={4}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={6}>
                Descrição
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
