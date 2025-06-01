import {useNavigate} from "react-router-dom";
import KanbanExpandedItemRow from "../../../../../../components/kanban/KanbanExpandedItemRow";
import {ActionButton} from "../../../../../../components/buttons/action/ActionButton";
import KanbanItem from "../../../../../../components/kanban/KanbanItem";
import KanbanItemPiece from "../../../../../../components/kanban/KanbanItemPiece";
import RequisicaoResponseData from "../../../../../../models/requisicao/RequisicaoResponseData.ts";
import idConversor from "../../../../../../utils/idConversor.ts";

type RequisicaoKanbanItemProps = {
    data: RequisicaoResponseData;
    redirectTo: string;
}

export default function RequisicaoKanbanItem({data, redirectTo} : RequisicaoKanbanItemProps) {
    const navigate = useNavigate();

    const expandedContent = (
        <>
            <KanbanExpandedItemRow
                title={"Solicitante"}
                hasBottomDivider={true}
            >
                {data.solicitante}
            </KanbanExpandedItemRow>
            {
                data.cliente &&
                <KanbanExpandedItemRow
                    title={"Cliente"}
                    hasBottomDivider={true}
                >
                    {data.cliente}
                </KanbanExpandedItemRow>
            }
            {
                data.prioridadeEnum &&
                <KanbanExpandedItemRow
                    title={"Prioridade"}
                    hasBottomDivider={true}
                >
                    {data.prioridadeEnum}
                </KanbanExpandedItemRow>
            }
            <ActionButton
                variant={"details"}
                onClick={() => {
                    navigate(redirectTo)
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
