import {memo, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useSearch from "../../../../../../hooks/useSearch.ts";
import MargemRow from "../../../components/rows/MargemRow";
import MargemDTO from "../../../../../../models/margem/MargemDTO.ts";
import MargemHeader from "../../../components/headers/MargemHeader";
import DeleteModal from "../../../../../../components/modals/DeleteModal";
import MargemEditModal from "../../modals/MargemEditModal";


/**
 * Tabela de exibição de grupos/subgrupos
 */
const MargemTable = memo( function () {
    const {currentView, refresh, refreshView} = useView();
    currentView.endpoint = useEndpoint().margem().GET().todos;

    const {currentEndpoint} = useSearch();

    const {toggleRequest, data, isLoading, error, isError} = useFetch(currentEndpoint);
    const [ hideDeleteModal, setHideDeleteModal ] = useState<boolean>(true);
    const [ hideEditModal, setHideEditModal ] = useState<boolean>(true);
    const [ selectedData, setSelectedData ] = useState<MargemDTO | null>(null);

    const handleClick = (type: "edit" | "delete", info: MargemDTO) => {
        setSelectedData(info);
        if (type === "edit") {
            setHideEditModal(false);
        } else {
            setHideDeleteModal(false);
        }
    }

    // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    const contentFunction =
        (dados: MargemDTO, index: number) => {
            return (
                <MargemRow stripped={index % 2 == 1} data={dados}
                           handleClick={handleClick}/>
            );
        }

    const content = useTableContent<MargemDTO>({
        isLoading,
        error,
        isError,
        data: data as MargemDTO[],
        errorMessage: "Erro ao carregar margens",
        contentFunction: contentFunction,
        beforeContent: () => <MargemHeader/>,
        currentView
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={useEndpoint().margem().DELETE().deletar(selectedData?.margemId as number)}
                errorMessage={"Erro ao deletar margem."}
                successMessage={"Margem deletada com sucesso."}
                idToDelete={selectedData?.margemId}
                onDelete={() => {
                    refreshView();
                    setHideDeleteModal(true);
                }}
            >
                Tem certeza que deseja deletar a margem {selectedData?.nome}?
            </DeleteModal>
            <MargemEditModal
                margem={selectedData}
                hide={hideEditModal}
                setHide={setHideEditModal}
            />
            <TableContainer barContent={
                <TopBarContent
                    hasSearch={true}
                    hasPagination={true}
                />
            }>
                {content}
            </TableContainer>
        </>
    );
});

export default MargemTable;
