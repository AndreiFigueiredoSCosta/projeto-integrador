import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de fornecedores de uma clonagem
 * @constructor
 */
export default function ClonagemFornecedorHeader(){
    return (
        <TableHeader>
            <HeaderPiece size={10}>
                Nome do Fornecedor
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
