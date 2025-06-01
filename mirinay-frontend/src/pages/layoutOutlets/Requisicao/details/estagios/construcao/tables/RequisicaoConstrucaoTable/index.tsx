import RequisicaoConstrucaoRow from "../../../../../components/rows/estagios/construcao/RequisicaoConstrucaoRow";
import RequisicaoConstrucaoHeader
    from "../../../../../components/headers/estagios/construcao/RequisicaoConstrucaoHeader";
import DeleteModal from "../../../../../../../../components/modals/DeleteModal";
import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import RequisicaoConstrucaoResponseData
    from "../../../../../../../../models/requisicao/construcao/RequisicaoConstrucaoResponseData.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import RequisicaoConstrucaoEditModal from "../../modals/RequisicaoConstrucaoEditModal";


/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function RequisicaoConstrucaoTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView } = useView();
    const [ auxId, setAuxId ] = useState<number | undefined>(undefined);
    const endpoint = `${useEndpoint().requisicao().informacoes().subinformacoes(id).construcao}`;
    const deleteEndpoint = useEndpoint().requisicao().operacoes(id).construcao().deletar(auxId);
    const { toggleRequest, data, isLoading, error, isError } = useFetch<RequisicaoConstrucaoResponseData>(endpoint);
    const [ selected, setSelected ] = useState<RequisicaoConstrucaoResponseData>();
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);
    const [ hideEditModal, setHideEditModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data?: RequisicaoConstrucaoResponseData) {

        switch (action){
            case "edit":
                setSelected(data);
                setHideEditModal(false);
                break;
            case "delete":
                setAuxId(data?.itemId);
                setHideDeleteModal(false);
                break;
        }
    }, [setAuxId, setSelected, setHideDeleteModal, setHideEditModal]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: RequisicaoConstrucaoResponseData, index: number) => {
        return (
            <RequisicaoConstrucaoRow
                stripped={index % 2 == 1}
                data={dados}
                handleDelete={() => handleClick("delete", dados)}
                handleEdit={() => handleClick("edit", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<RequisicaoConstrucaoResponseData>({
        isLoading,
        error,
        isError,
        data: data as RequisicaoConstrucaoResponseData[],
        errorMessage: "Erro ao carregar produtos",
        contentFunction: contentFunction,
        beforeContent: () => <RequisicaoConstrucaoHeader />
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={deleteEndpoint}
                errorMessage={"Erro ao deletar o produto."}
                successMessage={"Produto deletado com sucesso!"}
                onDelete={
                    () => {
                        refreshDetails();
                        refreshView();
                    }
                }
            >
                Tem certeza que deseja deletar o produto de referencia {selected?.referencia}?
            </DeleteModal>

            <RequisicaoConstrucaoEditModal
                hide={hideEditModal}
                setHide={setHideEditModal}
                data={selected}
            />

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
