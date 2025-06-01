import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de Listagem de Pedidos
 * @constructor
 */
export default function ListaPedidosHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={2}/>
            <HeaderPiece size={4}>
                Produto
            </HeaderPiece>
            <HeaderPiece size={4}>
                Quantidade
            </HeaderPiece>
            <HeaderPiece size={4}>
                Requisição
            </HeaderPiece>
            <HeaderPiece size={4}>
                Unidade
            </HeaderPiece>
            <HeaderPiece size={4}>
                Destino
            </HeaderPiece>
        </TableHeader>
    );
}
