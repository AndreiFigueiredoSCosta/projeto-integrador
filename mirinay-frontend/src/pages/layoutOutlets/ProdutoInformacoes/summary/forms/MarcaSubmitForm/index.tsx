import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { useRef } from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import Input from "../../../../../../components/form/input/Input";

interface MarcaRequestData extends Record<string | symbol, unknown>{
    nome: string;
}

/**
 * Formulário de submissão da marca de um produto
 * @constructor
 */
export default function MarcaSubmitForm(){
    const { isSubmitContainerVisible, refreshView } = useView();
    const endpoint= useEndpoint().marca().cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate<MarcaRequestData>(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const name = formData.get("nome") as string;

        let RequestData = {
                nome: name,
            } as MarcaRequestData;

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
            successMessage: "Marca cadastrada com sucesso.",
            errorMessage: "Erro ao cadastrar marca."
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
        </SubmitContainer>
    );
}
