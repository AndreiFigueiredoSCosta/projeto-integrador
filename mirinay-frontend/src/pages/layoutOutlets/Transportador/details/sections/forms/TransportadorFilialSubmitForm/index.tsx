import Input from "../../../../../../../components/form/input/Input";
import {useParams} from "react-router-dom";
import useView from "../../../../../../../hooks/useView.ts";
import {useRef} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import {SubmitContainer} from "../../../../../../../components/misc/SubmitContainer";
import Switch from "../../../../../../../components/form/misc/Switch";
import MatrizFilialEnum from "../../../../../../../enums/MatrizFilialEnum.ts";
import TransportadorCnpjRequestData
    from "../../../../../../../models/transportador/request/TransportadorCnpjRequestData.ts";

/**
 * Formulário de submissão de grupo/subgrupo
 * @constructor
 */
export default function TransportadorFilialSubmitForm(){
    const viewContext = useView();
    const id = useParams().transportadorId as unknown as number;
    const endpoint = useEndpoint().transportadorCnpj().operacoes(id, 0).cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const apelido = formData.get("apelido") as string;
        const email = formData.get("email") as string;
        const celular = formData.get("celular") as string;
        const telefone = formData.get("telefone") as string;
        const matrizSwitch = formData.get("matriz") as string;
        const cnpj = formData.get("cnpj") as string;

        const tipo = matrizSwitch === "on"? MatrizFilialEnum.MATRIZ : MatrizFilialEnum.FILIAL;

        const RequestData = {
            nome: apelido,
            email: email,
            telefone: telefone,
            celular: celular,
            cnpj: cnpj,
            tipo: tipo
        } as TransportadorCnpjRequestData;

        execute(RequestData);
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
        successMessage: "CNPJ cadastrado com sucesso.",
        errorMessage: "Erro ao cadastrar CNPJ."
    })

    return (
        <SubmitContainer hide={!viewContext.isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <Input
                    type={'email'}
                    name={'email'}
                    label={'Email'}
                    required={true}
                    minLength={3}
                    maxLength={255}
                />
                <Input
                    type={'text'}
                    name={'apelido'}
                    label={'Apelido do CNPJ'}
                    required={false}
                    minLength={3}
                    maxLength={255}
                />
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
            }}>
                <Input
                    type={'text'}
                    name={'cnpj'}
                    label={'CNPJ'}
                    required={true}
                    minLength={14}
                    maxLength={18}
                />
                <Switch name={"matriz"}>
                    Matriz
                </Switch>
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <Input
                    type={'text'}
                    name={'telefone'}
                    label={'Telefone'}
                    required={true}
                    minLength={9}
                    maxLength={15}
                />
                <Input
                    type={'text'}
                    name={'celular'}
                    label={'Celular'}
                    required={false}
                    minLength={9}
                    maxLength={15}
                />
            </div>
        </SubmitContainer>
    );
}
