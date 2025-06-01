import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de grupos de produtos
 * @constructor
 */
export default function ProdutoGrupoHeader(){
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece>
                Nome do grupo
            </HeaderPiece>
        </TableHeader>
    );
}
