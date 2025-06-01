import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useRef} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer/index.tsx";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import MargemDTO from "../../../../../../models/margem/MargemDTO.ts";
import Input from "../../../../../../components/form/input/Input/index.tsx";
import { ClienteDTO } from "../../../../../../models/cliente/ClienteDTO.ts";

export default function ClientesSubmitForm(){
    const { isSubmitContainerVisible, refreshView } = useView();
    const endpoint = useEndpoint().cliente().POST().cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const nomeCompleto = formData.get("nome");
        const cpf = formData.get("cpf");
        const dataNascimento = formData.get("nascimento") 
        const email = formData.get("email");
        const telefone = formData.get("telefone");

        const RequestData = {
            nomeCompleto: nomeCompleto,
            cpf: cpf,
            email: email,
            telefone: telefone,
            nascimento: dataNascimento
        } as ClienteDTO;

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
            successMessage: "Cliente cadastrado com sucesso.",
            errorMessage: "Erro ao cadastrar cliente."
        });

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <Input type={"text"} label={"Nome completo"} name={"nome"} required={true} minLength={3} maxLength={255}/>
            <Input type={"cpf"} label={"CPF"} name={"cpf"} required={true} min={14} max={14} step={0.01}/>
            <Input type={"email"} label={"E-mail"} name={"email"} required={true} min={0} max={100} step={0.01}/>
            <Input type={"tel"} label={"telefone"} name={"telefone"} required={true} min={0} max={100} step={0.01}/>
            <Input type={"date"} label={"Data de nascimento"} name={"nascimento"} required={true} min={0} max={100} step={0.01}/>             
        </SubmitContainer>
    );
}
