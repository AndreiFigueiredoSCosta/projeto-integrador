import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useCallback, useRef, useState} from "react";
import useView from "../../../../../../../hooks/useView.ts";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import {SubmitContainer} from "../../../../../../../components/misc/SubmitContainer";
import RequestSelect from "../../../../../../../components/form/select/RequestSelect";
import {useParams} from "react-router-dom";

/**
 * Formulário de submissão de grupo/subgrupo
 * @constructor
 */
export default function ProdutoConjuntoSubmitForm(){
    const viewContext = useView();
    const produtoId = useParams().produtoId as unknown as number;
    const [ conjuntoId, setConjuntoId ] = useState<number | undefined>(undefined);
    const addConjuntoEndpoint =
        useEndpoint().produto().operacoes(produtoId).componente(conjuntoId).addConjunto;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(addConjuntoEndpoint);

    const updateComponenteId = useCallback((value: number) => {
        return setConjuntoId(value);
    }, [setConjuntoId]);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const conjunto = formData.get("conjunto") as unknown as number;

        updateComponenteId(conjunto);

        execute({});
    }

    const handleSubmit = useFormHandler({
        formRef,
        isSuccess,
        onSuccess: () => {
            viewContext.refreshView();
        },
        isError,
        error,
        formHandler: formHandler,
        successMessage: "Produto inserido nesse conjunto com sucesso.",
        errorMessage: "Erro ao inserir produto nesse conjunto!"
    })

    return (
        <SubmitContainer hide={!viewContext.isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().produto().buscar(inputValue).select;
                }}
                name={"conjunto"}
                label={"Conjunto a ser inserido"}
                required={true}
                disabled={isLoading}
            />
        </SubmitContainer>
    );
}
