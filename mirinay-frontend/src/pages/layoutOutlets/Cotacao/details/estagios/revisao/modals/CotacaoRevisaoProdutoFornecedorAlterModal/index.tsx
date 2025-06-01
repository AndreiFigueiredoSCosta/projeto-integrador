import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useEffect, useRef, useState} from "react";
import FormModal from "../../../../../../../../components/modals/FormModal/index.tsx";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import RequestSelect from "../../../../../../../../components/form/select/RequestSelect";
import CotacaoRevisaoProdutoFornecedorResponseData
    from "../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoFornecedorResponseData.ts";
import useDropdown from "../../../../../../../../hooks/useDropdown.ts";
import {SelectOption} from "../../../../../../../../types/SelectOption.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data?: CotacaoRevisaoProdutoFornecedorResponseData
}

export default function CotacaoRevisaoProdutoFornecedorAlterModal({hide, setHide, data}: GrupoDetailsEditModalProps) {
    const id = useParams().requisicaoId as unknown as number;
    const { refreshDropdown } = useDropdown();
    const [ cnpjAtual, setCnpjAtual ] = useState<SelectOption>();
    const [ selectedCnpj, setSelectedCnpj ] = useState<SelectOption>();
    const editEndpoint = useEndpoint().cotacao().PATCH().revisao(id).item(0).alterarCnpjCotacao(data?.cotacaoId as number, selectedCnpj?.value as number);
    const formRef = useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(editEndpoint, {
        method: "PUT"
    });

    useEffect(() => {
        if (data){
            setCnpjAtual({
                value: data.cnpjId,
                label: data.cnpj
            } as SelectOption)
            setSelectedCnpj({
                value: data.cnpjId,
                label: data.cnpj
            } as SelectOption)
        }
    }, [data, setSelectedCnpj, setCnpjAtual]);

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
                refreshDropdown();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "CNPJ alterado com sucesso.",
            errorMessage: "Erro ao alterar CNPJ."
        });

    return (
        <FormModal
            title={"Alterar CNPJ"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Alterar CNPJ"}
            isSubmitDisabled={cnpjAtual?.value as number === selectedCnpj?.value as number}
        >
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().fornecedorCNPJ().buscas(inputValue).selectFromFornecedor(data?.fornecedorId as number)
                }}
                name={'cnpj'}
                label={'CNPJ'}
                selected={selectedCnpj}
                onSelect={(value) =>{
                    return setSelectedCnpj(value as SelectOption);
                }}
                disabled={isLoading}
                required={true}
            />
            {/*TODO: Alterar para FormTable*/}
        </FormModal>
    );
}
