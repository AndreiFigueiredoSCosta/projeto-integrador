import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../../../../hooks/useEndpoint.ts";
import {useEffect, useState} from "react";
import {useFetch} from "../../../../../../../../../../hooks/useFetch.ts";
import useTableContent from "../../../../../../../../../../hooks/useTableContent.tsx";
import {BlankHeader} from "../../../../../../../../../../components/table/BlankHeader";
import RequestSelect from "../../../../../../../../../../components/form/select/RequestSelect";
import {SelectOption} from "../../../../../../../../../../types/SelectOption.ts";
import {ActionButton} from "../../../../../../../../../../components/buttons/action/ActionButton";
import CotacaoRevisaoProdutoFornecedorResponseData
    from "../../../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoFornecedorResponseData.ts";
import CotacaoRevisaoProdutoFornecedorRow from "./components/CotacaoRevisaoProdutoFornecedorRow";
import CotacaoRevisaoProdutoFornecedorHeader from "./components/CotacaoRevisaoProdutoFornecedorHeader";
import CotacaoRevisaoProdutoFornecedorAddFornecedorModal
    from "../../../../../../../details/estagios/revisao/modals/CotacaoRevisaoProdutoFornecedorAddFornecedorModal";
import DeleteModal from "../../../../../../../../../../components/modals/DeleteModal";
import {useMutate} from "../../../../../../../../../../hooks/useMutate.ts";
import useToastManager from "../../../../../../../../../../hooks/useToastManager.ts";
import {useErrorHandling} from "../../../../../../../../../../hooks/useErrorHandling.ts";
import ConfirmModal from "../../../../../../../../../../components/modals/ConfirmModal";
import CotacaoRevisaoProdutoFornecedorAlterModal
    from "../../../../../../../details/estagios/revisao/modals/CotacaoRevisaoProdutoFornecedorAlterModal";
import useDropdown from "../../../../../../../../../../hooks/useDropdown.ts";

interface ClonagemFornecedorRowProps {
    itemId: number,
    similarId: number
}

/**
 * Linha de exibição de item de produto de uma clonagem
 * @constructor
 */
export default function CotacaoRevisaoProdutoClonagem({itemId, similarId}
                                                          : ClonagemFornecedorRowProps) {
    const id = useParams().requisicaoId as unknown as number;
    const { rowRefresh, refreshDropdown } = useDropdown();
    const endpoint = useEndpoint().cotacao().GET().detalhes(id).revisao().produto().cotacoesDeItem(itemId);
    const [ selected, setSelected ] = useState<SelectOption | null>(null);
    const [ selectedData, setSelectedData ] = useState<CotacaoRevisaoProdutoFornecedorResponseData | null>(null);
    const [ hideDelete, setHideDelete ] = useState<boolean>(true);
    const [ hideAlter, setHideAlter ] = useState<boolean>(true);
    const [ hideAddFornecedor, setHideAddFornecedor ] = useState<boolean>(true);
    const { isError, error, data, isLoading, toggleRequest } = useFetch<CotacaoRevisaoProdutoFornecedorResponseData>(endpoint);

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, rowRefresh]);

    const handleClick = (type: string, data: CotacaoRevisaoProdutoFornecedorResponseData) => {
        setSelectedData(data);
        switch (type) {
            case "edit":
                setHideAlter((prev) => !prev);
                break;
            case "delete":
                setHideDelete((prev) => !prev);
                break;
        }
    }

    // Sim, eu sei que tá feio, mas o tempo ta curto
    const beforeContent = () => {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
            }}>
                <BlankHeader>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        width: "100%",
                        alignItems: "center",
                        padding: "5px 10px",
                    }}>
                        <div style={{
                            display: "flex",
                            gap: "10px",
                            width: "fit-content",
                            alignItems: "center"
                        }}>
                            <div style={{
                                display: "flex",
                                gap: "5px",
                                width: "fit-content",
                                alignItems: "center"
                            }}>
                                <RequestSelect
                                    endpoint={(inputValue) => {
                                        return useEndpoint().similar().buscar(inputValue).clonagensDeSimilar(similarId);
                                    }}
                                    name={"clonagem"}
                                    label={"Clonagem"}
                                    selected={selected}
                                    onSelect={(value) => {
                                        return setSelected(value)
                                    }}
                                    required={true}
                                    style={{
                                        minWidth: "200px"
                                    }}
                                    type={"on-click"}
                                />
                                <LoadClonagemButton
                                    itemId={itemId}
                                    clonagemId={selected?.value as number}
                                />
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center"
                        }}>
                            <ActionButton
                                variant={"submit"}
                                onClick={() => {
                                    setHideAddFornecedor(false);
                                }}
                                size={"small"}
                            >
                                Adicionar CNPJs
                            </ActionButton>
                        </div>
                    </div>
                </BlankHeader>
                <CotacaoRevisaoProdutoFornecedorHeader />
            </div>
        );
    }

    const contentFunction = (dados: CotacaoRevisaoProdutoFornecedorResponseData, index: number) => {
        return (
            <CotacaoRevisaoProdutoFornecedorRow
                data={dados}
                stripped={index % 2 == 0}
                handleDelete={() => handleClick("delete", dados)}
                handleEdit={() => handleClick("edit", dados)}
            />
        );
    }

    const content = useTableContent<CotacaoRevisaoProdutoFornecedorResponseData>({
        isError,
        isLoading,
        contentFunction,
        limited: false,
        error,
        data: data as CotacaoRevisaoProdutoFornecedorResponseData[],
        errorMessage: "Erro ao buscar fornecedores clonados."
    });

    return (
        <>
            <CotacaoRevisaoProdutoFornecedorAddFornecedorModal
                hide={hideAddFornecedor}
                setHide={setHideAddFornecedor}
                itemId={itemId}
            />
            <CotacaoRevisaoProdutoFornecedorAlterModal
                hide={hideAlter}
                setHide={setHideAlter}
                data={selectedData as CotacaoRevisaoProdutoFornecedorResponseData}
            />
            <DeleteModal
                hide={hideDelete}
                setHide={setHideDelete}
                request={useEndpoint().cotacao().DELETE().revisao(id).item(itemId).removerCotacao}
                errorMessage={"Erro ao remover fornecedor."}
                idToDelete={selectedData?.cotacaoId as number}
                successMessage={"Fornecedor removido com sucesso!"}
                onDelete={() => {
                    refreshDropdown();
                }}
            >
                Deseja realmente remover o fornecedor {selectedData?.nomeFornecedor} de CNPJ {selectedData?.cnpj}?
            </DeleteModal>
            {beforeContent()}
            {content}
        </>
    );
}


type types = {
    itemId: number,
    clonagemId: number
}

function LoadClonagemButton({itemId, clonagemId}: types) {
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().cotacao().POST().revisao(id).item().clonar(itemId, clonagemId);
    const {execute, isLoading, isError, error, isSuccess} = useMutate(endpoint);
    const [hideConfirm, setHideConfirm] = useState(true);
    const { refreshDropdown } = useDropdown();
    const {success} = useToastManager();

    useEffect(() => {
        if (isSuccess) {
            success("Cotações clonadas com sucesso.");
            refreshDropdown();
        }
    }, [isSuccess, success]);

    useErrorHandling(isError, error, "Erro ao clonar cotações.");

    return (
        <>
            <ConfirmModal
                hide={hideConfirm}
                setHide={setHideConfirm}
                title={"Deseja realmente usar essa clonagem?"}
                onConfirm={() =>{
                    execute({
                        itemId: itemId,
                        clonagemId: clonagemId,
                    });
                    setHideConfirm(true);
                }}
            >
                Ao clonar esses fornecedores, você irá substituir os fornecedores atuais por fornecedores da clonagem selecionada.
            </ConfirmModal>
            <ActionButton
                variant={"details"}
                onClick={() => {
                    setHideConfirm(false);
                }}
                size={"small"}
                hasLoading={isLoading}
                disabled={!clonagemId || clonagemId <= 0}
            >
                Clonar
            </ActionButton>
        </>
    )
}
