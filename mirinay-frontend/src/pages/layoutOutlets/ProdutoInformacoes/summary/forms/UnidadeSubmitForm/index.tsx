import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { useRef } from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import Input from "../../../../../../components/form/input/Input";

interface UnidadeRequestData extends Record<string | symbol, unknown>{
    nome: string;
    sigla: string;
}

/**
 * Formulário de submissão da unidade de um produto
 * @constructor
 */
export default function UnidadeSubmitForm(){
    const { isSubmitContainerVisible, refreshView } = useView();
    const endpoint= useEndpoint().unidade().cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate<UnidadeRequestData>(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const name = formData.get("nome") as string;
        const sigla = formData.get("sigla") as string;

        let RequestData = {
                nome: name,
                sigla: sigla,
            } as UnidadeRequestData;

        execute(RequestData);
    }

    const handleSubmit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Unidade cadastrada com sucesso.",
            errorMessage: "Erro ao cadastrar unidade."
        });

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <Input type={"text"}
                   label={"Nome"}
                   name={"nome"}
                   required={true}
                   minLength={3}
                   maxLength={255}
            />
            <Input type={"text"}
                   label={"Sigla"}
                   name={"sigla"}
                   required={true}
                   minLength={1}
                   maxLength={255}
            />
        </SubmitContainer>
    );
}
