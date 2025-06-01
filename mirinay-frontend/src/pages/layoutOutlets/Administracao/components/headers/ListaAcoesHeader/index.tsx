import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de Listagem de Pedidos
 * @constructor
 */
export default function ListaAcoesHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={1}/>
            <HeaderPiece size={4}>
                Ação
            </HeaderPiece>
            <HeaderPiece size={8}>
                Modulo
            </HeaderPiece>
        </TableHeader>
    );
}
