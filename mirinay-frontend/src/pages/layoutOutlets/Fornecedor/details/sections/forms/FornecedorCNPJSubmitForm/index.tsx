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
import {Select} from "../../../../../../../components/form/select/Select";
import EstadosOptions from "../../../../../../../utils/EstadosOptions.ts";
import FornecedorCNPJRequestData from "../../../../../../../models/fornecedor/request/FornecedorCNPJRequestData.ts";

/**
 * Formulário de submissão de grupo/subgrupo
 * @constructor
 */
export default function FornecedorCNPJSubmitForm(){
    const viewContext = useView();
    const id = useParams().fornecedorId as unknown as number;
    const endpoint = useEndpoint().fornecedorCNPJ().operacoes(id).cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const nome = formData.get("nome") as string;
        const email = formData.get("email") as string;
        const estado = formData.get("estado") as string;
        const cidade = formData.get("cidade") as string;
        const telefone = formData.get("telefone") as string;
        const matrizSwitch = formData.get("matriz") as string;
        const cnpj = formData.get("cnpj") as string;
        const pedidoMinimo = formData.get("pedidoMinimo") as unknown as number;

        const tipo = matrizSwitch === "on"? MatrizFilialEnum.MATRIZ : MatrizFilialEnum.FILIAL;

        const RequestData = {
            nome: nome,
            email: email,
            telefone: telefone,
            cnpj: cnpj,
            tipo: tipo,
            fornecedorId: id,
            estado: estado,
            cidade: cidade,
            pedidoMinimo: pedidoMinimo
        } as FornecedorCNPJRequestData;

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
                    name={'nome'}
                    label={'Nome Fantasia'}
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
                <Switch name={"matriz"} defaultChecked={false}>
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
                    type={'number'}
                    name={'pedidoMinimo'}
                    label={'Pedido Mínimo'}
                    required={true}
                    min={0}
                    step={0.01}
                />
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <Select
                    label={"Estado"}
                    options={EstadosOptions}
                    name={"estado"}
                    required={true}
                />
                <Input
                    type={'text'}
                    name={'cidade'}
                    label={'Cidade'}
                    required={false}
                    minLength={3}
                    maxLength={255}
                />
            </div>
        </SubmitContainer>
);
}
