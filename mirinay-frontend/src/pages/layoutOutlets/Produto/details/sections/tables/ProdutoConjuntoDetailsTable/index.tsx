import {TableContainer} from "../../../../../../../components/table/TableContainer";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import { useEffect, useState} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../hooks/useTableContent.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../../components/modals/DeleteModal";
import ProdutoResponseData from "../../../../../../../models/produto/response/ProdutoResponseData.ts";
import ProdutoHeader from "../../../../components/headers/ProdutoHeader";
import ProdutoConjuntoRow from "../../../../components/rows/ProdutoConjuntoRow";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function ProdutoConjuntoDetailsTable() {
    const produtoId = useParams().produtoId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView } = useView();
    const [ conjuntoId, setConjuntoId ] = useState<number | undefined>(undefined);
    const endpoint = `${useEndpoint().produto().informacoes(produtoId).conjuntos}`;
    const deleteEndpoint = useEndpoint().produto().operacoes(produtoId).componente(conjuntoId).removerConjunto;
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
            <ProdutoConjuntoRow
                stripped={index % 2 == 1}
                data={dados}
                deleteFunction={() => {
                    setConjuntoId(dados.id);
                    return setHideDeleteModal(false);
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
        errorMessage: "Erro ao carregar conjuntos",
        contentFunction: contentFunction,
        beforeContent: () => <ProdutoHeader />
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={deleteEndpoint}
                errorMessage={"Erro ao deletar o conjunto."}
                successMessage={"Conjunto deletado com sucesso!"}
                onDelete={
                    () => {
                        refreshDetails();
                        refreshView();
                    }
                }
            >
                Tem certeza que deseja deletar o conjunto?
            </DeleteModal>

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
