import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import CotacaoRevisaoProdutoRow from "../../../../../components/rows/estagios/revisao/CotacaoRevisaoProdutoRow";
import CotacaoRevisaoProdutoResponseData
    from "../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoResponseData.ts";
import CotacaoRevisaoProdutoHeader
    from "../../../../../components/headers/estagios/revisao/CotacaoRevisaoProdutoHeader";
import DropdownProvider from "../../../../../../../../contexts/dropdown/DropdownProvider";
import CotacaoRevisaoProdutoSubmitModal from "../../modals/CotacaoRevisaoProdutoSubmitModal";
import CotacaoRevisaoProdutoEditModal from "../../modals/CotacaoRevisaoProdutoEditModal";
import CotacaoRevisaoProdutoAlterModal from "../../modals/CotacaoRevisaoProdutoAlterModal";
import DeleteModal from "../../../../../../../../components/modals/DeleteModal";
import EstadoEnum from "../../../../../../../../enums/EstadoEnum.ts";


/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function CotacaoRevisaoProdutoTable() {
    const id = useParams().requisicaoId as unknown as number;
    const { globalRefresh } = useDetails();
    const { refresh, refreshView } = useView();
    const endpoint = `${useEndpoint().cotacao().GET().detalhes(id).revisao().produto().itens}`;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<CotacaoRevisaoProdutoResponseData>(endpoint);
    const [ mappedData, setMappedData ] = useState<CotacaoRevisaoProdutoResponseData[]>();
    const [ selected, setSelected ] = useState<CotacaoRevisaoProdutoResponseData>();
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);
    const [ hideEditModal, setHideEditModal ] = useState(true);
    const [ hideSubmitModal, setHideSubmitModal ] = useState(true);
    const [ hideAlterModal, setHideAlterModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    useEffect(() => {
        const mapped = data as CotacaoRevisaoProdutoResponseData[];
        const ativos = mapped?.filter((item) => item.estado !== EstadoEnum.REMOVIDO);
        const removidos = mapped?.filter((item) => item.estado === EstadoEnum.REMOVIDO);

        return setMappedData(ativos?.concat(removidos));
    }, [data]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data: CotacaoRevisaoProdutoResponseData) {
            setSelected(data);

            switch (action){
                case "edit":
                    setHideEditModal(false);
                    break;
                case "delete":
                    setHideDeleteModal(false);
                    break;
                case "submit":
                    setHideSubmitModal(false);
                    break;
                case "alter":
                    setHideAlterModal(false);
                    break;
            }
        }, [setSelected, setHideDeleteModal, setHideEditModal]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: CotacaoRevisaoProdutoResponseData, index: number) => {
        return (
            <DropdownProvider>
                <CotacaoRevisaoProdutoRow
                    stripped={index % 2 == 1}
                    data={dados}
                    handleDelete={() => handleClick("delete", dados)}
                    handleEdit={() => handleClick("edit", dados)}
                    handleSubmit={() => handleClick("submit", dados)}
                    handleAlter={() => handleClick("alter", dados)}
                />
            </DropdownProvider>
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<CotacaoRevisaoProdutoResponseData>({
        isLoading,
        error,
        isError,
        data: mappedData as CotacaoRevisaoProdutoResponseData[],
        errorMessage: "Erro ao carregar produtos",
        contentFunction: contentFunction,
        beforeContent: () => <CotacaoRevisaoProdutoHeader />
    });

    return (
        <>
            <CotacaoRevisaoProdutoSubmitModal
                hide={hideSubmitModal}
                setHide={setHideSubmitModal}
                data={selected}
            />
            <CotacaoRevisaoProdutoEditModal
                hide={hideEditModal}
                setHide={setHideEditModal}
                data={selected}
            />
            <CotacaoRevisaoProdutoAlterModal
                hide={hideAlterModal}
                setHide={setHideAlterModal}
                data={selected}
            />
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={useEndpoint().cotacao().DELETE().revisao(id).item().remover}
                errorMessage={"Erro ao remover item."}
                successMessage={"Item removido com sucesso!"}
                idToDelete={selected?.itemId as number}
                onDelete={() =>{
                    refreshView();
                }}
            >
                Deseja realmente remover o item {selected?.referencia}?
            </DeleteModal>
            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
