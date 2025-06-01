import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de Listagem de Pedidos
 * @constructor
 */
export default function ListaUsuariosHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={4}>
                Nome
            </HeaderPiece>
            <HeaderPiece size={4}>
                Email
            </HeaderPiece>
            <HeaderPiece size={8}>
                Telefone
            </HeaderPiece>
            <HeaderPiece size={8}>
                Data Criação
            </HeaderPiece>
            <HeaderPiece size={8}>
                Data Atualização
            </HeaderPiece>
        </TableHeader>
    );
}
