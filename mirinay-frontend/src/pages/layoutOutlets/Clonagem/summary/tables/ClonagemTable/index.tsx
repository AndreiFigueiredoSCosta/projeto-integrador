import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import ClonagemResponseData from "../../../../../../models/clonagem/response/ClonagemResponseData.ts";
import ClonagemRow from "../../../components/rows/ClonagemRow";
import ClonagemHeader from "../../../components/headers/ClonagemHeader";
import DeleteModal from "../../../../../../components/modals/DeleteModal";
import useSearch from "../../../../../../hooks/useSearch.ts";

interface ClonagemTableProps {
    handleInsert: (info: ClonagemResponseData) => void
}

/**
 * Tabela de exibição de clonagens
 */
const ClonagemTable = memo( function ClonagemTable ({handleInsert} : ClonagemTableProps) {
    const { currentView, refresh, refreshView } = useView();
    currentView.endpoint = `${useEndpoint().clonagem().todos}`;

    const { currentEndpoint } = useSearch();

    const { toggleRequest, data, isLoading, error, isError } = useFetch<ClonagemResponseData>(currentEndpoint);
    const [hideDelete, setHideDelete] = useState<boolean>(true);
    const [ selectedClonagem, setSelectedClonagem ] = useState<ClonagemResponseData>();

    // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const handleClick = (type: "delete" | "insert", info: ClonagemResponseData) => {
        setSelectedClonagem(info);
        switch (type) {
            case "delete":
                setHideDelete(false);
                break;
            case "insert":
                handleInsert(info);
                break;
        }
    }

    const contentFunction =
        (dados: ClonagemResponseData, index: number) => {
        return (
            <ClonagemRow
                data={dados}
                handleClick={(type) => handleClick(type, dados)}
                stripped={index % 2 == 1}
            />
        );
    }

    const content = useTableContent<ClonagemResponseData>({
        isLoading,
        error,
        isError,
        data: data as ClonagemResponseData[],
        errorMessage: "Erro ao carregar clonagens!",
        contentFunction: contentFunction,
        beforeContent: () => <ClonagemHeader />
    });

    return (
        <>
            <DeleteModal hide={hideDelete}
                         setHide={setHideDelete}
                         request={useEndpoint().clonagem(selectedClonagem?.clonagemId).deletar}
                         errorMessage={"Erro ao deletar clonagem!"}
                         successMessage={"Clonagem deletada com sucesso!"}
                         onDelete={() =>{
                                    setSelectedClonagem(undefined);
                                    refreshView();
                                }}
            >
                Tem certeza que deseja deletar a clonagem {selectedClonagem?.nome}?
            </DeleteModal>
            <TableContainer barContent={<TopBarContent />}>
                {content}
            </TableContainer>
        </>
)
});

export default ClonagemTable;
