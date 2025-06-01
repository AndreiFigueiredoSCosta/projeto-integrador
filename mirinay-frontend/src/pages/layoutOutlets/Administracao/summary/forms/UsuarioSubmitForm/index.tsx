import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useEffect, useRef, useState} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import UsuarioRequestData from "../../../../../../models/administracao/UsuarioRequestData.ts";
import Input from "../../../../../../components/form/input/Input";
import {Select} from "../../../../../../components/form/select/Select";
import RequestSelect from "../../../../../../components/form/select/RequestSelect";
import {SelectOption} from "../../../../../../types/SelectOption.ts";
import AutorizacaoResponseData from "../../../../../../models/administracao/AutorizacaoResponseData.ts";


/**
 * Formulário de submissão de grupo/subgrupo
 * @param visible - Se o formulário está visível
 * @constructor
 */
type UsuarioSubmitFormProps = {
    autorizacoes?: AutorizacaoResponseData;
};

export default function UsuarioSubmitForm({ autorizacoes }: UsuarioSubmitFormProps) {
    const viewContext = useView();
    const endpointPrincipal = useEndpoint().administacao().POST().registrarUsuario;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpointPrincipal);
    const [ selectedItem, setSelectedItem ] = useState<SelectOption | null>(null);

    useEffect(() => {
        if (autorizacoes) {
            setSelectedItem({
                label: autorizacoes?.nome,
                value: autorizacoes?.id
            });
        }

    }, [autorizacoes]);
    // Função para processar e enviar os dados
    const formHandler = (formData: FormData) => {
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const name = formData.get("name") as string;
        const telefone = formData.get("telefone") as string;
        const gender = formData.get("gender") as string;
        const autorizacaoId = Number(formData.get("autorizacaoId"));

        const requestData: UsuarioRequestData = {
            email,
            password,
            name,
            telefone,
            gender,
            autorizacaoId,
        };

        execute(requestData);
    };

    const handleSubmit = useFormHandler({
        formRef,
        isSuccess,
        onSuccess: () => {
            viewContext.refreshView();
        },
        isError,
        error,
        formHandler: formHandler,
        successMessage: "Usuário cadastrado com sucesso.",
        errorMessage: "Erro ao cadastrar usuário.",
    });

    return (
        <SubmitContainer hide={!viewContext.isSubmitContainerVisible} onSubmit={handleSubmit} formRef={formRef} isLoading={isLoading}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Input type="email" name="email" label="Email" required />
                <Input type="password" name="password" label="Senha" required />
                <Input type="text" name="name" label="Nome" required />
                <Input type="text" name="telefone" label="Telefone" required />

                <Select name="gender" label="Gênero" required options={[
                    { label: "Masculino", value: "M" },
                    { label: "Feminino", value: "F" },
                    { label: "Outro", value: "O" },
                ]} />

                <RequestSelect
                    endpoint={(inputValue) => {
                        return useEndpoint().fornecedor().buscas(inputValue).select;
                    }}
                    name={"autorizacaoId"}
                    label={"Autorização"}
                    required={true}
                    selected={selectedItem}
                />
            </div>
        </SubmitContainer>
    );
}
