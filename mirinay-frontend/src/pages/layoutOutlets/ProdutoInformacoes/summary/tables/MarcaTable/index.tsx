import {memo, useCallback, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../components/modals/DeleteModal";
import MarcaHeader from "../../../components/headers/MarcaHeader";
import MarcaEditModal from "../../modals/MarcaEditModal";
import MarcaRow from "../../../components/rows/MarcaRow";
import useSearch from "../../../../../../hooks/useSearch.ts";

export interface MarcaResponseData {
    id: number;
    nome: string;
}

/**
 * Tabela de exibição de grupos/subgrupos
 */
const MarcaTable = memo( function MarcaTable () {
    const { currentView, refresh, refreshView } = useView();
    currentView.endpoint = useEndpoint().marca().todos;

    const { currentEndpoint, addSearchView } = useSearch();

    useEffect(() => {
        addSearchView("Código", useEndpoint().marca().search().id);
        addSearchView("Nome", useEndpoint().marca().search().nome);
    }, []);

    const [selectedData, setSelectedData] = useState<MarcaResponseData>();
    const deleteEndpoint = useEndpoint().marca(selectedData?.id).deletar;
    const [deleteHide, setDeleteHide] = useState<boolean>(true);
    const [editHide, setEditHide] = useState<boolean>(true);
    const { toggleRequest, data, isLoading, error, isError } = useFetch<MarcaResponseData>(currentEndpoint);

    // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    // Click handling
    const handleClick = useCallback((type: string, dados: MarcaResponseData) =>{
        setSelectedData(dados);
        switch (type){
            case 'edit':
                setEditHide(false);
                break;
            case 'delete':
                setDeleteHide(false);
                break;
        }
    }, []);

    const contentFunction =
        (dados: MarcaResponseData, index: number) => {
        return (
            <MarcaRow handleClick={handleClick} stripped={index % 2 == 1} data={dados}/>
        );
    }

    const content = useTableContent<MarcaResponseData>({
        isLoading,
        error,
        isError,
        data: data as MarcaResponseData[],
        errorMessage: "Erro ao carregar marcas",
        contentFunction: contentFunction,
        beforeContent: () => <MarcaHeader />
    });

    return (
        <>
            <DeleteModal hide={deleteHide}
                         setHide={setDeleteHide}
                         request={`${deleteEndpoint}`}
                         errorMessage={"Erro ao deletar marca."}
                         successMessage={"Marca deletada com sucesso."}
                         onDelete={
                                    () => {
                                        refreshView();
                                    }
                                }
                                >
                Tem certeza que deseja deletar essa marca?
            </DeleteModal>

            <MarcaEditModal hide={editHide}
                            setHide={setEditHide}
                            data={selectedData}
            />

            <TableContainer barContent={<TopBarContent hasPagination={true} hasSearch={true} />}>
                {content}
            </TableContainer>
        </>
    )
});

export default MarcaTable;
