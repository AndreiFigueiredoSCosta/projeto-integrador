import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useEffect, useRef, useState} from "react";
import FormModal from "../../../../../../../../components/modals/FormModal/index.tsx";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import {SelectOption} from "../../../../../../../../types/SelectOption.ts";
import {useFetch} from "../../../../../../../../hooks/useFetch.ts";
import CotacaoRevisaoFornecedorRequestData
    from "../../../../../../../../models/cotacao/revisao/request/CotacaoRevisaoFornecedorRequestData.ts";
import RequestSelect from "../../../../../../../../components/form/select/RequestSelect";
import Switch from "../../../../../../../../components/form/misc/Switch";
import FormTable from "../../../../../../../../components/misc/FormTable";
import useDropdown from "../../../../../../../../hooks/useDropdown.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    itemId: number
}

export default function CotacaoRevisaoProdutoFornecedorAddFornecedorModal({
                                                                              hide,
                                                                              setHide,
                                                                              itemId
                                                                          }: GrupoDetailsEditModalProps) {
    const id = useParams().requisicaoId as unknown as number;
    const {refreshDropdown} = useDropdown();
    const [useMatriz, setUseMatriz] = useState<boolean>(true);
    const [selectedCNPJs, setSelectedCNPJs] = useState<number[]>([]);
    const [selectedFornecedor, setSelectedFornecedor] = useState<SelectOption | null>(null);
    const endpoint = useEndpoint().cotacao().POST().revisao(id).item().inserirCnpjs(itemId);
    const formRef = useRef<HTMLFormElement>(null);
    const {execute, isSuccess, isError, error, isLoading} = useMutate(endpoint);
    const {data: cnpjsId, toggleRequest} = useFetch<number>(
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
            setHide(true);
            refreshDropdown();
            setSelectedFornecedor(null);
            setSelectedCNPJs([]);
            setUseMatriz(true);
        },
        isError,
        error,
        formHandler: formHandler,
        successMessage: "Fornecedores adicionados com sucesso.",
        errorMessage: "Erro ao inserir fornecedores."
    })

    useEffect(() => {
        if (!useMatriz) {
            toggleRequest();
        }
    }, [useMatriz, toggleRequest]);
    return (
        <FormModal
            title={"Adicionar fornecedores"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleSubmit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Adicionar"}
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
                    alreadySelectedChecks={cnpjsId as number[]}
                    topText={`CNPJs de ${selectedFornecedor?.label}`}
                    idReference={"id"}
                    nameReference={"cnpj"}
                    auxNameReference={"tipo"}
                    doRequest={selectedFornecedor !== null}
                />
            }
        </FormModal>
    );
}

