import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import DropdownProvider from "../../../../../../../../contexts/dropdown/DropdownProvider";
import DeleteModal from "../../../../../../../../components/modals/DeleteModal";
import CotacaoCotacaoItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoItemResponseData.ts";
import CotacaoCotacaoProdutoRow from "../../../../../components/rows/estagios/cotacao/CotacaoCotacaoProdutoRow";
import CotacaoCotacaoCotacaoResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoCotacaoResponseData.ts";
import ConfirmModal from "../../../../../../../../components/modals/ConfirmModal";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import CotacaoCotacaoProdutoHeader
    from "../../../../../components/headers/estagios/cotacao/CotacaoCotacaoProdutoHeader";
import useToastManager from "../../../../../../../../hooks/useToastManager.ts";
import {useErrorHandling} from "../../../../../../../../hooks/useErrorHandling.ts";
import CotacaoCotacaoFornecedorItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorItemResponseData.ts";
import Input from "../../../../../../../../components/form/input/Input";


interface CotacaoCotacaoProdutoTableProps {
    setCotacao: (value: ((((prevState: CotacaoCotacaoCotacaoResponseData | CotacaoCotacaoFornecedorItemResponseData | undefined) => CotacaoCotacaoCotacaoResponseData) | CotacaoCotacaoCotacaoResponseData) | undefined) | CotacaoCotacaoFornecedorItemResponseData) => void,
    setItem?: (value: (((prevState: (CotacaoCotacaoItemResponseData | undefined)) => (CotacaoCotacaoItemResponseData | undefined)) | CotacaoCotacaoItemResponseData | undefined)) => void
}

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function CotacaoCotacaoProdutoTable({
                                                       setCotacao,
                                                       setItem = () => {},
                                                   }: CotacaoCotacaoProdutoTableProps) {
    const id = useParams().requisicaoId as unknown as number;
    const {globalRefresh, refreshDetails} = useDetails();
    const {refresh, refreshView, setIsSubmitContainerVisible} = useView();
    const endpoint = `${useEndpoint().cotacao().GET().detalhes(id).cotacao().itens().itens}`;
    const {toggleRequest, data, isLoading, error, isError} = useFetch<CotacaoCotacaoItemResponseData>(endpoint);
    const [mappedData, setMappedData] = useState<CotacaoCotacaoItemResponseData[]>();
    const [selectedData, setSelectedData] = useState<CotacaoCotacaoItemResponseData>();
    const [selectedCotacao, setSelectedCotacao] = useState<CotacaoCotacaoCotacaoResponseData>();
    const [quantidadeReap, setQuantidadeReap] = useState<number | undefined>(undefined);
    const reapEndpoint = `${useEndpoint().cotacao().PATCH().cotacao(id)
        .reaproveitar(selectedData?.itemId as number, selectedCotacao?.cotacaoId as number, quantidadeReap as unknown as number)}`;
    const {success} = useToastManager();
    const [hideDeleteModal, setHideDeleteModal] = useState(true);
    const [hideConfirmModal, setHideConfirmModal] = useState(true);
    const {
        execute,
        isLoading: reapIsLoading,
        isError: isReapError,
        error: reapError,
        isSuccess
    } = useMutate(reapEndpoint,
        {
            method: 'PATCH'
        });

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);


    const sortData = (data: CotacaoCotacaoItemResponseData[]) => {
        return setMappedData(data.sort((a, b) => {
            return a.estado.localeCompare(b.estado);
        }));
    }

    useEffect(() => {
        if (data) {
            sortData(data as CotacaoCotacaoItemResponseData[]);
        }
    }, [data]);

    const updateSelectedData = (dados: CotacaoCotacaoItemResponseData) => {
        return setSelectedData(dados);
    }

    const updateSelectedCotacao = (dados: CotacaoCotacaoCotacaoResponseData) => {
        return setSelectedCotacao(dados);
    }

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data: CotacaoCotacaoCotacaoResponseData, dados: CotacaoCotacaoItemResponseData) {
            switch (action) {
                case "cotar":
                    setCotacao(data);
                    setItem(dados);
                    setIsSubmitContainerVisible(true);
                    break;
                case "reaproveitar":
                    updateSelectedCotacao(data);
                    setHideConfirmModal(false);
                    break;
            }
        }, [setCotacao, setIsSubmitContainerVisible, setItem]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: CotacaoCotacaoItemResponseData, index: number) => {
            return (
                <DropdownProvider>
                    <CotacaoCotacaoProdutoRow
                        stripped={index % 2 == 1}
                        data={dados}
                        handleCotar={(data) => handleClick("cotar", data, dados)}
                        handleReap={(data) => {
                            updateSelectedData(dados);
                            handleClick("reaproveitar", data, dados);
                        }}
                        handleDescl={() => {
                            setSelectedData(dados);
                            setHideDeleteModal(false);
                        }}
                    />
                </DropdownProvider>
            );
        }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<CotacaoCotacaoItemResponseData>({
        isLoading,
        error,
        isError,
        data: mappedData as CotacaoCotacaoItemResponseData[],
        errorMessage: "Erro ao carregar produtos",
        contentFunction,
        beforeContent: () => <CotacaoCotacaoProdutoHeader/>
    });

    useEffect(() => {
        if (isSuccess) {
            refreshView();
            refreshDetails();
            success("Cotação reaproveitada com sucesso!", null, true);
        }
    }, [refreshDetails, refreshView, isSuccess, success]);

    useErrorHandling(isReapError, reapError, "Erro ao reaproveitar cotação.");

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={useEndpoint().cotacao().DELETE().cotacao(id).desclassificar().item(selectedData?.itemId as number)}
                errorMessage={"Erro ao desclassificar item."}
                successMessage={"Item desclassificado com sucesso!"}
                idToDelete={selectedData?.itemId as number}
                onDelete={() => {
                    setHideDeleteModal(true);
                    refreshView();
                }}
            >
                Deseja realmente desclassificar o item {selectedData?.referencia}?
            </DeleteModal>

            <ConfirmModal
                hide={hideConfirmModal}
                setHide={setHideConfirmModal}
                title={"Reaproveitar item"}
                onConfirm={() => {
                    setHideConfirmModal(true);
                    execute({});
                }}
                confirmBtnText={"Reaproveitar"}
                isLoading={reapIsLoading}
            >
                Deseja realmente reaproveitar o item {selectedData?.nomeProduto}?
                <Input
                    type={"number"}
                    label={"Quantidade"}
                    name={"quantidade"}
                    min={1}
                    max={selectedData?.quantidade}
                    step={1}
                    required={true}
                    onChange={(value) => {
                        return setQuantidadeReap(value as unknown as number);
                    }}
                    value={quantidadeReap as unknown as string}
                />
            </ConfirmModal>
            <TableContainer size={"small"}>
                {content}
            </TableContainer>
        </>
    );
}
