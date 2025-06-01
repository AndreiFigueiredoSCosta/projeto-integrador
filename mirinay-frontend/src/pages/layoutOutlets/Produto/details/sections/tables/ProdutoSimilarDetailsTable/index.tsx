import {TableContainer} from "../../../../../../../components/table/TableContainer";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../hooks/useTableContent.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../../components/modals/DeleteModal";
import SimilarResponseData from "../../../../../../../models/produto/response/SimilarResponseData.ts";
import ProdutoSimilarDetailsRow from "../../../../components/rows/ProdutoSimilarDetailsRow";
import ProdutoSimilarDetailsHeader from "../../../../components/headers/ProdutoSimilarDetailsHeader";
import ProdutoSimilarDetailsEditModal from "../../modals/ProdutoSimilarDetailsEditModal";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function ProdutoSimilarDetailsTable() {
    const produtoId = useParams().produtoId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView } = useView();
    const [ similarId, setSimilarId ] = useState<number | undefined>(undefined);
    const endpoint = `${useEndpoint().produto().informacoes(produtoId).similares}`;
    const deleteEndpoint = useEndpoint().similar().operacoes(0,similarId).deletar;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<SimilarResponseData>(endpoint);
    const [ selectedSimilar, setSelectedSimilar ] = useState<SimilarResponseData>();
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);
    const [ hideEditModal, setHideEditModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, similar?: SimilarResponseData) {

        switch (action){
            case "edit":
                setSelectedSimilar(similar);
                setHideEditModal(false);
                break;
            case "delete":
                setSimilarId(similar?.idSimilar);
                setHideDeleteModal(false);
                break;
        }
    }, [setSimilarId, setSelectedSimilar, setHideDeleteModal, setHideEditModal]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: SimilarResponseData, index: number) => {
        return (
            <ProdutoSimilarDetailsRow
                stripped={index % 2 == 1}
                data={dados}
                deleteFunction={() => handleClick("delete", dados)}
                editFunction={() => handleClick("edit", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<SimilarResponseData>({
        isLoading,
        error,
        isError,
        data: data as SimilarResponseData[],
        errorMessage: "Erro ao carregar similares",
        contentFunction: contentFunction,
        beforeContent: () => <ProdutoSimilarDetailsHeader />
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={deleteEndpoint}
                errorMessage={"Erro ao deletar o item."}
                successMessage={"Similar deletado com sucesso!"}
                onDelete={
                    () => {
                        refreshDetails();
                        refreshView();
                    }
                }
            >
                Tem certeza que deseja deletar o similar de referência {selectedSimilar?.codigoReferencia}?
            </DeleteModal>

            <ProdutoSimilarDetailsEditModal
                hide={hideEditModal}
                setHide={setHideEditModal}
                data={selectedSimilar}
            />

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
