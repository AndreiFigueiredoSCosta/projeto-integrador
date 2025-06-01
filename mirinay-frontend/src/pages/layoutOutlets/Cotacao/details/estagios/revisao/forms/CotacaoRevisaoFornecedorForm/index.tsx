import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useEffect, useRef, useState} from "react";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import {SubmitContainer} from "../../../../../../../../components/misc/SubmitContainer";
import RequestSelect from "../../../../../../../../components/form/select/RequestSelect";
import FormTable from "../../../../../../../../components/misc/FormTable";
import {SelectOption} from "../../../../../../../../types/SelectOption.ts";
import Switch from "../../../../../../../../components/form/misc/Switch";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import ConfirmModal from "../../../../../../../../components/modals/ConfirmModal";
import CotacaoRevisaoFornecedorRequestData
    from "../../../../../../../../models/cotacao/revisao/request/CotacaoRevisaoFornecedorRequestData.ts";

/**
 * Formulário de submissão de grupo/subgrupo
 * @constructor
 */
export default function CotacaoRevisaoFornecedorForm(){
    const {isSubmitContainerVisible, refreshView} = useView();
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().cotacao().POST().revisao(id).fornecedor().inserir;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);
    const [ selectedFornecedor, setSelectedFornecedor ] = useState<SelectOption | null>(null);
    const [ useMatriz, setUseMatriz ] = useState<boolean>(true);
    const [ selectedCNPJs, setSelectedCNPJs ] = useState<number[]>([]);
    const [ hideConfirmModal, setHideConfirmModal ] = useState<boolean>(true);
    const { data, toggleRequest } = useFetch<number>(
        useEndpoint()
            .cotacao().GET().detalhes(id).revisao()
            .fornecedor().idsJaInseridosDeFornecedor(selectedFornecedor?.value as unknown as number)
    );

    // Faz uma requisição de delete ao backend
    const formHandler = () => {
        const requestData = {
            cnpjIds: selectedCNPJs,
            fornecedorId: selectedFornecedor?.value as unknown as number
        } as CotacaoRevisaoFornecedorRequestData;

        execute(requestData);
    }

    const handleSubmit = useFormHandler({
        formRef,
        isSuccess,
        onSuccess: () => {
            refreshView();
        },
        isError,
        error,
        formHandler: formHandler,
        successMessage: "Item inserido com sucesso.",
        errorMessage: "Erro ao inserir item."
    })

    useEffect(() => {
        if (!useMatriz){
            toggleRequest();
        }
    }, [useMatriz, toggleRequest]);

    return (
        <>
            {/*Modal para confirmar a adição de fornecedores*/}
            <ConfirmModal
                hide={hideConfirmModal}
                setHide={setHideConfirmModal}
                title={"Confirmar inserção"}
                confirmBtnText={"Inserir"}
                onConfirm={() => {
                    handleSubmit();
                    return setHideConfirmModal(true);
                }}
                isLoading={isLoading}
            >
                Deseja realmente adicionar esses fornecedores?
            </ConfirmModal>

            <SubmitContainer hide={!isSubmitContainerVisible}
                             onSubmit={(e) => {
                                 e.preventDefault();
                                 if ((selectedFornecedor && selectedCNPJs.length > 0) ||
                                     (selectedFornecedor && selectedCNPJs.length == 0)){
                                        setHideConfirmModal(false);
                                    }
                             }}
                             formRef={formRef}
                             isLoading={isLoading}
                             isButtonDisabled={(!selectedFornecedor && useMatriz) || (!useMatriz && selectedCNPJs.length <= 0)}
                             size={"small"}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px"
                }}>
                    <RequestSelect
                        endpoint={(inputValue) => {
                            return useEndpoint().fornecedor().buscas(inputValue).select;
                        }}
                        name={"fornecedor"}
                        label={"Fornecedor"}
                        required={true}
                        onSelect={(option) => {
                            setSelectedFornecedor(option);
                            setUseMatriz(true);
                        }}
                        disabled={isLoading}
                    />
                    <Switch
                        name={"matriz"}
                        checked={useMatriz}
                        disabled={!selectedFornecedor}
                        onClick={() => setUseMatriz((prevState) => !prevState)}>
                        Matriz
                    </Switch>
                </div>
                {
                    !useMatriz &&
                    <FormTable
                        errorMessage={"Erro ao carregar CNPJs"}
                        endpoint={useEndpoint().fornecedor().informacoes(selectedFornecedor?.value as unknown as number).cnpjs}
                        setSelectedChecks={setSelectedCNPJs}
                        alreadySelectedChecks={data as number[]}
                        topText={`CNPJs de ${selectedFornecedor?.label}`}
                        idReference={"id"}
                        nameReference={"cnpj"}
                        auxNameReference={"tipo"}
                        doRequest={selectedFornecedor !== null}
                    />
                }
            </SubmitContainer>
        </>
    );
}
