import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useParams} from "react-router-dom";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useRef, useState} from "react";
import FormModal from "../../../../../../../../components/modals/FormModal/index.tsx";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import RequestSelect from "../../../../../../../../components/form/select/RequestSelect";
import {SelectOption} from "../../../../../../../../types/SelectOption.ts";
import CotacaoRevisaoProdutoResponseData
    from "../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoResponseData.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data?: CotacaoRevisaoProdutoResponseData
}

export default function CotacaoRevisaoProdutoAlterModal({hide, setHide, data}: GrupoDetailsEditModalProps) {
    const id = useParams().requisicaoId as unknown as number;
    const { refreshView } = useView();
    const [ selectedProduto, setSelectedProduto ] = useState<SelectOption | null>(null);
    const [ selectedSimilar, setSelectedSimilar ] = useState<SelectOption | null>(null);
    const endpoint = useEndpoint().cotacao().PATCH().revisao(id).item(data?.itemId as number).alterarReferencia(selectedSimilar?.value as number);
    const formRef = useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(endpoint, {
        method: "PATCH"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = () => {
        execute({});
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                refreshView();
                setSelectedProduto(null);
                setSelectedSimilar(null);
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Item editado com sucesso.",
            errorMessage: "Erro ao editar o item."
        });

    return (
        <FormModal
            title={"Alterar referência de item"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Alterar"}
        >
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().produto().buscar(inputValue).select;
                }}
                name={'produto'}
                label={"Produto"}
                onSelect={(value) => {
                    return setSelectedProduto(value);
                }}
                selected={selectedProduto}
                disabled={isLoading}
                required={true}
            />
            {
                selectedProduto &&
                <RequestSelect
                    endpoint={(inputValue) => {
                        return useEndpoint().produto().buscar(inputValue).similaresDeProduto(selectedProduto.value as number);
                    }}
                    name={"similar"}
                    label={"Referência"}
                    required={true}
                    disabled={isLoading}
                    onSelect={(value) => {
                        return setSelectedSimilar(value)
                    }}
                    selected={selectedSimilar}
                />
            }
        </FormModal>
    )
        ;
}
