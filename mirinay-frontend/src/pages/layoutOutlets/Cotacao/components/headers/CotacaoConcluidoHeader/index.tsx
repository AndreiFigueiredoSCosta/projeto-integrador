import {TableHeader} from "../../../../../../components/table/TableHeader";
import {HeaderPiece} from "../../../../../../components/table/components/HeaderPiece";

export default function CotacaoConcluidoHeader() {
    return (
        <TableHeader>
            <HeaderPiece size={3}>
                Nome da requisição
            </HeaderPiece>
            <HeaderPiece size={3}>
                Solicitante
            </HeaderPiece>
            <HeaderPiece size={2}>
                Destino
            </HeaderPiece>
            <HeaderPiece size={2}>
                Status
            </HeaderPiece>
            <HeaderPiece size={2}>
            </HeaderPiece>

        </TableHeader>
    );
}
