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
export default function ProdutoComponenteSubmitForm(){
    const viewContext = useView();
    const produtoId = useParams().produtoId as unknown as number;
    console.log(produtoId);
    const [ componenteId, setComponenteId ] = useState<number | undefined>(undefined);
    const addConjuntoEndpoint =
        useEndpoint().produto().operacoes(produtoId).componente(componenteId).addComponente;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(addConjuntoEndpoint);

    const updateConjuntoId = useCallback((value: number) => {
        return setComponenteId(value);
    }, [setComponenteId]);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const componente = formData.get("componente") as unknown as number;

    console.log("Conjunto id: "+componente);

        updateConjuntoId(componente);

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
        successMessage: "Componente inserido nesse produto com sucesso.",
        errorMessage: "Erro ao inserir componente!"
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
                name={"componente"}
                label={"Componente desse produto"}
                required={true}
                disabled={isLoading}
            />
        </SubmitContainer>
    );
}
