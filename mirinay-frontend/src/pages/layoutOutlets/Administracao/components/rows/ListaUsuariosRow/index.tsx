import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import UsuarioResponseData from "../../../../../../models/administracao/UsuarioResponseData.ts";

interface UsuarioRowProps {
    data: UsuarioResponseData;
    stripped: boolean;

}

/**
 * Linha de exibição de listagem de pedidos
 * @constructor
 */
export default function ListaUsuariosRow({ data } : UsuarioRowProps) {


    return (
        <TableRow>

            <RowPiece size={4}>
                {data.nome}
            </RowPiece>
            <RowPiece size={4}>
                {data.email}
            </RowPiece>
            <RowPiece size={8}>
                {data.telefone}
            </RowPiece>
            <RowPiece size={8}>
                {data.dataCriacao}
            </RowPiece>
            <RowPiece size={8}>
                {data.dataAtualizacao}
            </RowPiece>
        </TableRow>
    );
}
