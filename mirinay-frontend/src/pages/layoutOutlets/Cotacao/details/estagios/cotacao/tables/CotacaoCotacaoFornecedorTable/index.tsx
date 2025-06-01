import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../hooks/useTableContent.tsx";
import {TableContainer} from "../../../../../../../../components/table/TableContainer";
import DeleteModal from "../../../../../../../../components/modals/DeleteModal";
import CotacaoCotacaoCotacaoResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoCotacaoResponseData.ts";
import CotacaoCotacaoFornecedorResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorResponseData.ts";
import CotacaoCotacaoFornecedorItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorItemResponseData.ts";
import ConfirmModal from "../../../../../../../../components/modals/ConfirmModal";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useErrorHandling} from "../../../../../../../../hooks/useErrorHandling.ts";
import CotacaoCotacaoFornecedorHeader
    from "../../../../../components/headers/estagios/cotacao/CotacaoCotacaoFornecedorHeader";
import CotacaoCotacaoFornecedorRow from "../../../../../components/rows/estagios/cotacao/CotacaoCotacaoFornecedorRow";
import useToastManager from "../../../../../../../../hooks/useToastManager.ts";
import Input from "../../../../../../../../components/form/input/Input";
import DropdownProvider from "../../../../../../../../contexts/dropdown/DropdownProvider";


interface CotacaoCotacaoFornecedorTableProps {
    setSelected: (value: (((prevState: CotacaoCotacaoCotacaoResponseData | CotacaoCotacaoFornecedorItemResponseData | undefined) => CotacaoCotacaoCotacaoResponseData) | CotacaoCotacaoCotacaoResponseData | undefined) | CotacaoCotacaoFornecedorItemResponseData) => void
}

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function CotacaoCotacaoFornecedorTable({
                                                          setSelected
                                                      }: CotacaoCotacaoFornecedorTableProps) {
    const id = useParams().requisicaoId as unknown as number;
    const {globalRefresh, refreshDetails} = useDetails();
    const {refresh, refreshView, setIsSubmitContainerVisible} = useView();
    const endpoint = `${useEndpoint().cotacao().GET().detalhes(id).cotacao().cotacoes().fornecedores}`;
    const {toggleRequest, data, isLoading, error, isError} = useFetch<CotacaoCotacaoFornecedorResponseData>(endpoint);
    const [selectedFornecedor, setSelectedFornecedor] = useState<CotacaoCotacaoFornecedorResponseData>();
    const [selectedItem, setSelectedItem] = useState<CotacaoCotacaoFornecedorItemResponseData>();
    const [hideDeleteModal, setHideDeleteModal] = useState(true);
    const [hideConfirmModal, setHideConfirmModal] = useState(true);
    const [hideGerarExcelModal, setHideGerarExcelModal] = useState(true);
    const [quantidadeReap, setQuantidadeReap] = useState<number | undefined>(undefined);
    const reapEndpoint = `${useEndpoint().cotacao().PATCH().cotacao(id).reaproveitar(0, selectedItem?.cotacaoId as number, quantidadeReap as unknown as number)}`;
    const excelEndpoint = `${useEndpoint().cotacao().GET().detalhes(id).cotacao().cotacoes().excel(selectedFornecedor?.cnpjId as number)}`;
    const {success} = useToastManager();
    const {
        isError: isReapError,
        error: reapError,
        isLoading: isReapLoading,
        execute: executeReap,
        isSuccess: isReapSuccess
    } = useMutate(reapEndpoint, {
        method: "PATCH"
    });


    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);
    const {
        isError: isExcelError,
        error: excelError,
        isLoading: isExcelLoading,
        isSuccess: isExcelSuccess,
        data: excelData,  // Pegamos os dados da resposta
        execute: executeExcel
    } = useMutate<Blob>(excelEndpoint, {
        method: "GET",
        responseType: 'blob'
    });


    const updateFornecedor = (dados: CotacaoCotacaoFornecedorResponseData) => {
        return setSelectedFornecedor(dados);
    }

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data: CotacaoCotacaoFornecedorItemResponseData) {
            setSelectedItem(data);

            switch (action) {
                case "desclassificar":
                    setHideDeleteModal(false);
                    break;
                case "reaproveitar":
                    setHideConfirmModal(false);
                    break;
                case "cotar":
                    setSelected(data);
                    setIsSubmitContainerVisible(true);
                    break;
                default:
                    break;
            }
        }, [setSelected, setHideConfirmModal, setIsSubmitContainerVisible]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: CotacaoCotacaoFornecedorResponseData, index: number) => {
            return (
                <DropdownProvider>
                    <CotacaoCotacaoFornecedorRow
                        stripped={index % 2 == 1}
                        data={dados}
                        handleCotar={(data) => {
                            handleClick("cotar", data);
                        }}
                        handleDescl={(data) => {
                            handleClick("desclassificar", data);
                        }}
                        handleReap={(data) => {
                            handleClick("reaproveitar", data);
                        }}
                        handleGerarExcel={() => {
                            updateFornecedor(dados);
                            setHideGerarExcelModal(false);
                        }}
                    />
                </DropdownProvider>
            );
        }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<CotacaoCotacaoFornecedorResponseData>({
        isLoading,
        error,
        isError,
        data: data as CotacaoCotacaoFornecedorResponseData[],
        errorMessage: "Erro ao carregar fornecedores",
        contentFunction: contentFunction,
        beforeContent: () => <CotacaoCotacaoFornecedorHeader/>
    });

    useErrorHandling(isReapError, reapError, "Erro ao reaproveitar cotação");

    useErrorHandling(isExcelError, excelError, "Erro ao gerar excel");

    useEffect(() => {
        if (isReapSuccess) {
            refreshView();
            refreshDetails();
            success("Cotação reaproveitada com sucesso!", null, true);
        }
    }, [refreshDetails, refreshView, isReapSuccess, success]);
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    useEffect(() => {
        if (isExcelSuccess && excelData) {
            const url = window.URL.createObjectURL(excelData);
            const link = document.createElement("a");
            link.href = url;
            const fileName = `${selectedFornecedor?.nomeFornecedor || "exportacao"}_${formattedDate}.xlsx`;

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            success("✅ Excel gerado e baixado com sucesso!");
        }
    }, [isExcelSuccess, excelData]);

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={useEndpoint().cotacao().DELETE().cotacao(id).desclassificar().cotacao(selectedItem?.cotacaoId as number)}
                errorMessage={"Erro ao desclassificado item"}
                successMessage={"Item desclassificado com sucesso!"}
                idToDelete={selectedItem?.cotacaoId as number}
                onDelete={() => {
                    refreshView();
                    refreshDetails();
                }}
            >
                Deseja realmente remover a cotação do item {selectedItem?.referencia} desse fornecedor?
            </DeleteModal>

            <ConfirmModal
                hide={hideConfirmModal}
                setHide={setHideConfirmModal}
                title={"Reaproveitar cotação?"}
                onConfirm={() => {
                    executeReap({});
                }}
                confirmBtnText={"Reaproveitar"}
                isLoading={isReapLoading}
            >
                Deseja realmente reaproveitar a cotação do item {selectedItem?.referencia} desse fornecedor?
                <Input
                    type={"number"}
                    label={"Quantidade"}
                    name={"quantidade"}
                    value={quantidadeReap as unknown as string}
                    onChange={(value) => {
                        setQuantidadeReap(value as unknown as number);
                    }}
                    step={1}
                    required={true}
                    min={1}
                />
            </ConfirmModal>

            <ConfirmModal
                hide={hideGerarExcelModal}
                setHide={setHideGerarExcelModal}
                title={`Deseja gerar um excel do fornecedor ${selectedFornecedor?.nomeFornecedor}?`}
                onConfirm={() => {
                    executeExcel({}); // Apenas chamamos a função sem segundo argumento
                }}
                confirmBtnText={"Gerar"}
                isLoading={isExcelLoading}
            >
                Deseja realmente gerar um excel com as cotações do fornecedor {selectedFornecedor?.nomeFornecedor}?
            </ConfirmModal>

            <TableContainer size={"small"}>
                {content}
            </TableContainer>
        </>
    );
}
