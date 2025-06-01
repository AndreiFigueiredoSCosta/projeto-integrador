import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de Similares
 * @constructor
 */
export default function FornecedorCNPJHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={3}>
                Nome Fantasia
            </HeaderPiece>
            <HeaderPiece size={3}>
                CNPJ
            </HeaderPiece>
            <HeaderPiece size={3}>
                Cidade - Estado
            </HeaderPiece>
            <HeaderPiece size={3}>
                Telefone/Email
            </HeaderPiece>
        </TableHeader>
    );
}
