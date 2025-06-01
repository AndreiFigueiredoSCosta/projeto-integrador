import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de produtos
 * @constructor
 */
export default function FornecedorCNPJDetailsHeader() {
    return (
        <TableHeader>
            <HeaderPiece size={2}>
                Nome Fantasia
            </HeaderPiece>
            <HeaderPiece size={2}>
                CNPJ
            </HeaderPiece>
            <HeaderPiece size={2}>
                Cidade - Estado
            </HeaderPiece>
            <HeaderPiece size={2}>
                Telefone/Email
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
            <HeaderPiece size={1}>
            </HeaderPiece>
        </TableHeader>
    );
}
