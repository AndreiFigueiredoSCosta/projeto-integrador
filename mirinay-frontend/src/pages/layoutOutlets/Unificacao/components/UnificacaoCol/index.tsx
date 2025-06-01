import useKanbanColContentFilter from "../../../../../hooks/useKanbanColContentFilter.tsx";
import UnificacaoKanbanItem from "../rows/UnificacaoKanbanItem";
import KanbanCol from "../../../../../components/kanban/KanbanCol";
import {UnificacaoResponseData} from "../../../../../models/unificacao/UnificacaoResponseData.ts";

export const UnificacaoCol = ({
                                  data,
                                  isLoading,
                                  handleSelect,
                                  grupo}
                                  : {
    data: UnificacaoResponseData[],
    isLoading: boolean,
    handleSelect: (data: UnificacaoResponseData) => void,
    grupo: string,
    emptySelectedItens?: boolean
}) =>{

    const colContent = useKanbanColContentFilter<UnificacaoResponseData>({
        isLoading: isLoading,
        data: data as UnificacaoResponseData[],
        contentFunction: (data) => {
            return (
                <UnificacaoKanbanItem
                    data={data}
                    redirectTo={`/detalhes/${data.itemId}`}
                    handleSelect={handleSelect}
                />
            );
        },
        filterHeader: "grupo",
        filterValue: grupo
    });

    return (
       <KanbanCol title={grupo} color={"random"} >
            {colContent}
        </KanbanCol>
    );
}
