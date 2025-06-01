import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

/**
 * Cabeçalho da tabela de subgrupos dos detalhes de um grupo
 * @constructor
 */
export default function PedidosDetailsHeader(){
    return (
        <TableHeader>
            <div style={{padding: "0 50px"}}>
                <HeaderPiece size={2}>
                    Nome
                </HeaderPiece>
            </div>
        </TableHeader>
    );
}
