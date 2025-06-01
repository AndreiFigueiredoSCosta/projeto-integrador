import {useNavigate} from "react-router-dom";
import KanbanExpandedItemRow from "../../../../../../components/kanban/KanbanExpandedItemRow";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import KanbanItem from "../../../../../../components/kanban/KanbanItem";
import KanbanItemPiece from "../../../../../../components/kanban/KanbanItemPiece";
import idConversor from "../../../../../../utils/idConversor.ts";
import CotacaoResponseData from "../../../../../../models/cotacao/CotacaoResponseData.ts";

type CotacaoKanbanItemProps = {
    data: CotacaoResponseData;
    redirectTo: string;
}

export default function CotacaoKanbanItem({data, redirectTo} : CotacaoKanbanItemProps) {
    const navigate = useNavigate();

    const expandedContent = (
        <>
            <KanbanExpandedItemRow
                title={"Solicitante"}
                hasBottomDivider={true}
            >
                {data.solicitante}
            </KanbanExpandedItemRow>
            <KanbanExpandedItemRow
                title={"Prioridade"}
                hasBottomDivider={false}
            >
                {data.prioridade}
            </KanbanExpandedItemRow>
            <ActionButton
                variant={"details"}
                onClick={() => {
                    navigate(`/cotacao${redirectTo}`)
                }}
                size={"small"}
            >
                Detalhes
            </ActionButton>
        </>
    );

    return (
        <KanbanItem expansible={true} expandedContent={expandedContent}>
            <KanbanItemPiece
                variant={"centered-text"}
                hasRightDivider={true}
            >
                {`${idConversor(data.requisicaoId)}`}
            </KanbanItemPiece>
            <KanbanItemPiece variant={"text"}>
                {data.nome}
            </KanbanItemPiece>
        </KanbanItem>
    );
}
