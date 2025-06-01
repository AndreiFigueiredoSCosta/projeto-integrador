import {useNavigate} from "react-router-dom";
import KanbanItem from "../../../../../../components/kanban/KanbanItem";
import KanbanItemPiece from "../../../../../../components/kanban/KanbanItemPiece";
import idConversor from "../../../../../../utils/idConversor.ts";
import {UnificacaoResponseData} from "../../../../../../models/unificacao/UnificacaoResponseData.ts";
import {useContext} from "react";
import {CheckContext} from "../../../summary/UnificacaoSummary";

type UnificacaoKanbanItemProps = {
    data: UnificacaoResponseData,
    redirectTo: string,
    handleSelect: (data: UnificacaoResponseData) => void,
}

export default function UnificacaoKanbanItem({data, redirectTo, handleSelect}: UnificacaoKanbanItemProps) {
    const navigate = useNavigate();
    const context = useContext(CheckContext)

    return (
        <KanbanItem onClick={() => {
            navigate(`unificacao${redirectTo}`)
        }
        }>
            <KanbanItemPiece
                hasRightDivider={true}
                variant={"checkbox"}
                handleCheckboxChange={() => {
                    handleSelect(data);
                }}
                resetCheck={context?.emptySelectedItens}
            />
            <KanbanItemPiece
                variant={"centered-text"}
                hasRightDivider={true}
            >
                {`${idConversor(data.requisicaoId)}`}
            </KanbanItemPiece>
            <KanbanItemPiece variant={"text"} hasRightDivider={true}>
                {data.nomeProduto}
            </KanbanItemPiece>
            <KanbanItemPiece variant={"text"}>
                {data.quantidade} UN
            </KanbanItemPiece>
        </KanbanItem>
    );
}
