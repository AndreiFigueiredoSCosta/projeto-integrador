import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useRef} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import MargemDTO from "../../../../../../models/margem/MargemDTO.ts";
import Input from "../../../../../../components/form/input/Input";

export default function MargemSubmitForm(){
    const { isSubmitContainerVisible, refreshView } = useView();
    const endpoint = useEndpoint().margem().POST().cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const nome = formData.get("nome") as string;
        const porcentagem = formData.get("porcentagem") as unknown as number;

        const RequestData = {
            nome: nome,
            valor: porcentagem,
        } as MargemDTO;

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
            successMessage: "Margem cadastrada com sucesso.",
            errorMessage: "Erro ao cadastrar margem."
        });

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <Input type={"text"} label={"Nome"} name={"nome"} required={true} minLength={3} maxLength={255}/>
            <Input type={"number"} label={"Porcentagem"} name={"porcentagem"} required={true} min={0} max={100} step={0.01}/>
        </SubmitContainer>
    );
}
