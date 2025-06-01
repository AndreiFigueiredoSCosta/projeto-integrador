import RequisicaoConcluidoResponseData from "../../../../../../models/requisicao/RequisicaoConcluidoResponseData.ts";
import {TableRow} from "../../../../../../components/table/TableRow";
import {RowPiece} from "../../../../../../components/table/components/RowPiece";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import {useNavigate} from "react-router-dom";
import {StatusBadge} from "../../../../../../components/misc/badges/default/StatusBadge";
import {StageBadge} from "../../../../../../components/misc/badges/default/StageBadge";
import idConversor from "../../../../../../utils/idConversor.ts";

type RequisicaoConcluidoTableRowProps = {
    stripped: boolean,
    data: RequisicaoConcluidoResponseData
}

export default function RequisicaoConcluidoTableRow({stripped, data}: RequisicaoConcluidoTableRowProps) {
    const navigate = useNavigate();

    return (
        <TableRow stripped={stripped}>
            <RowPiece size={3}>
                {idConversor(data.requisicaoId)} - {data.nome}
            </RowPiece>
            <RowPiece size={3}>
                {data.solicitante}
            </RowPiece>
            <RowPiece size={2}>
                <StageBadge variant={"green"}>
                    {data.destinoEnum}
                </StageBadge>
            </RowPiece>
            <RowPiece size={2}>
                <StatusBadge
                    variant={data.aprovada ? "success" : "danger"}
                    style={{
                        maxWidth: '80%',
                        }}
                >
                    {data.aprovada ? "Aprovada" : "Reprovada"}
                </StatusBadge>
            </RowPiece>
            <RowPiece size={2}>
                <ActionButton
                    variant={"details"}
                    size={"small"}
                    onClick={() => {
                        navigate(`/requisicao/detalhes/concluido/${data.requisicaoId}`)
                    }}
                    style={{
                        maxWidth: '80%',
                    }}
                >
                    Detalhes
                </ActionButton>
            </RowPiece>
        </TableRow>
    );
}
