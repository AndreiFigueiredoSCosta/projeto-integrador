import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho do dropdown de produtos de uma clonagem
 * @constructor
 */
export default function ClonagemProdutoHeader(){
    return (
        <TableHeader dropdown={true}>
            <HeaderPiece size={10}>
                Nome do produto
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>
        </TableHeader>
    );
}
