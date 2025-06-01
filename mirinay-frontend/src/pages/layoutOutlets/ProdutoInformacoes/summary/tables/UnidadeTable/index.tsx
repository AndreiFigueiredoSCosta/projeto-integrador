import {memo, useCallback, useEffect, useState} from "react";
import {useFetch} from "../../../../../../hooks/useFetch.ts";
import TopBarContent from "../../../../../../components/table/TopBarContent";
import {TableContainer} from "../../../../../../components/table/TableContainer";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import useTableContent from "../../../../../../hooks/useTableContent.tsx";
import useView from "../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../components/modals/DeleteModal";
import UnidadeRow from "../../../components/rows/UnidadeRow";
import UnidadeHeader from "../../../components/headers/UnidadeHeader";
import UnidadeEditModal from "../../modals/UnidadeEditModal";
import useSearch from "../../../../../../hooks/useSearch.ts";

export interface UnidadeResponseData {
    unidadeId: number;
    nome: string;
    sigla: string;
}

//Dados para teste sem a API
// const dataTeste: UnidadeResponseData[] = [
//     {
//         unidadeId: 1,
//         nome: "Sigla 1",
//         sigla: "S1"
//     },
//     {
//         unidadeId: 2,
//         nome: "Sigla 2",
//         sigla: "S2"
//     },
//     {
//         unidadeId: 3,
//         nome: "Sigla 3",
//         sigla: "S3"
//     }
// ];

/**
 * Tabela de exibição de unidades
 */
const UnidadeTable = memo( function UnidadeTable () {
    const { currentView, refresh, refreshView } = useView();
    currentView.endpoint = useEndpoint().unidade().todos;

    const { currentEndpoint, addSearchView } = useSearch();

    useEffect(() => {
        addSearchView("Nome ou sigla", useEndpoint().unidade().search().sigla_nome);
    }, []);

    const [selectedData, setSelectedData] = useState<UnidadeResponseData>();
    const deleteEndpoint = useEndpoint().unidade(selectedData?.unidadeId).deletar;
    const [deleteHide, setDeleteHide] = useState<boolean>(true);
    const [editHide, setEditHide] = useState<boolean>(true);
    const { toggleRequest, data, isLoading, error, isError } = useFetch<UnidadeResponseData>(currentEndpoint);

    // Primeira ativação da request para a API quando o componente é carregado (busca de dados inicial)
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, refresh]);

    // Click handling
    const handleClick = useCallback((type: string, dados: UnidadeResponseData) =>{
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
        (dados: UnidadeResponseData, index: number) => {
        return (
            <UnidadeRow handleClick={handleClick} stripped={index % 2 == 1} data={dados}/>
        );
    }

    const content = useTableContent<UnidadeResponseData>({
        isLoading,
        error,
        isError,
        data: data as UnidadeResponseData[],
        errorMessage: "Erro ao carregar unidades",
        contentFunction: contentFunction,
        beforeContent: () => <UnidadeHeader />
    });

    return (
        <>
            <DeleteModal hide={deleteHide}
                         setHide={setDeleteHide}
                         request={`${deleteEndpoint}`}
                         errorMessage={"Erro ao deletar a unidade."}
                         successMessage={"Unidade deletada com sucesso."}
                         onDelete={
                                    () => {
                                        refreshView();
                                    }}
                                >
                Tem certeza que deseja deletar essa unidade?
            </DeleteModal>

            <UnidadeEditModal hide={editHide}
                            setHide={setEditHide}
                            data={selectedData}
            />

            <TableContainer barContent={<TopBarContent hasSearch={true} hasPagination={true} minToSearch={2} />}>
                {content}
            </TableContainer>
        </>
    )
});

export default UnidadeTable;
