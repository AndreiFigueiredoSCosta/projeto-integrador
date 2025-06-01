import {TableContainer} from "../../../../../../../components/table/TableContainer";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import {useEffect, useState} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../hooks/useTableContent.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../../components/modals/DeleteModal";
import ProdutoResponseData from "../../../../../../../models/produto/response/ProdutoResponseData.ts";
import ProdutoHeader from "../../../../components/headers/ProdutoHeader";
import ProdutoComponenteRow from "../../../../components/rows/ProdutoComponenteRow";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function ProdutoComponenteDetailsTable() {
    const produtoId = useParams().produtoId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView } = useView();
    const [ componenteId, setComponenteId ] = useState<number | undefined>(undefined);
    const endpoint = `${useEndpoint().produto().informacoes(produtoId).componentes}`;
    const deleteEndpoint = useEndpoint().produto().operacoes(produtoId).componente(componenteId).removerComponente;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<ProdutoResponseData>(endpoint);
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: ProdutoResponseData, index: number) => {
        return (
            <ProdutoComponenteRow
                stripped={index % 2 == 1}
                data={dados}
                hasDelete={true}
                deleteFunction={() => {
                    setComponenteId(dados.id)
                    return setHideDeleteModal(false)
                }}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<ProdutoResponseData>({
        isLoading,
        error,
        isError,
        data: data as ProdutoResponseData[],
        errorMessage: "Erro ao carregar componentes",
        contentFunction: contentFunction,
        beforeContent: () => <ProdutoHeader />
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={deleteEndpoint}
                errorMessage={"Erro ao deletar o componente."}
                successMessage={"Componente deletado com sucesso!"}
                onDelete={
                    () => {
                        refreshDetails();
                        refreshView();
                    }
                }
            >
                Tem certeza que deseja deletar esse componente?
            </DeleteModal>

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
