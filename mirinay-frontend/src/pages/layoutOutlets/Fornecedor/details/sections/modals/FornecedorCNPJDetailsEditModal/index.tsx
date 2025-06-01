import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import React from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import FormModal from "../../../../../../../components/modals/FormModal";
import Input from "../../../../../../../components/form/input/Input";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import useView from "../../../../../../../hooks/useView.ts";
import MatrizFilialEnum from "../../../../../../../enums/MatrizFilialEnum.ts";
import Switch from "../../../../../../../components/form/misc/Switch";
import {Select} from "../../../../../../../components/form/select/Select";
import EstadosOptions from "../../../../../../../utils/EstadosOptions.ts";
import FornecedorCNPJResponseData from "../../../../../../../models/fornecedor/response/FornecedorCNPJResponseData.ts";
import FornecedorCNPJRequestData from "../../../../../../../models/fornecedor/request/FornecedorCNPJRequestData.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data?: FornecedorCNPJResponseData
}

export default function FornecedorCNPJDetailsEditModal({hide, setHide, data}: GrupoDetailsEditModalProps) {
    const id = useParams().fornecedorId as unknown as number;
    const { refreshDetails } = useDetails();
    const { refreshView } = useView();
    const editEndpoint = useEndpoint().fornecedorCNPJ().operacoes(data?.id).editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(editEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
            const nome = formData.get("nome") as string;
            const email = formData.get("email") as string;
            const cidade = formData.get("cidade") as string;
            const estado = formData.get("estado") as string;
            const telefone = formData.get("telefone") as string;
            const matrizSwitch = formData.get("matriz") as string;
            const cnpj = formData.get("cnpj") as string;

            const tipo = matrizSwitch === "on"? MatrizFilialEnum.MATRIZ : MatrizFilialEnum.FILIAL;

            const RequestData = {
                id: data?.id,
                nome: nome,
                cnpj: cnpj,
                email: email,
                telefone: telefone,
                tipo: tipo,
                fornecedorId: id,
                cidade: cidade,
                estado: estado
            } as FornecedorCNPJRequestData;

            execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                refreshDetails();
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "CNPJ editado com sucesso.",
            errorMessage: "Erro ao editar o CNPJ."
        });

    return (
        <FormModal
            title={"Editar CNPJ"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
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
                    value={data?.email ?? ""}
                />
                <Input
                    type={'text'}
                    name={'nome'}
                    label={'Nome Fantasia'}
                    required={false}
                    minLength={3}
                    maxLength={255}
                    value={data?.nome ?? ""}
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
                    value={data?.cnpj ?? ""}
                />
                <Switch name={"matriz"} checked={data?.tipo == MatrizFilialEnum.MATRIZ}>
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
                    value={data?.telefone ?? ""}
                />
                <Select
                    label={"Estado"}
                    options={EstadosOptions}
                    name={"estado"}
                    required={true}
                    value={EstadosOptions.find((estado) => estado.value === data?.estado)}
                />
                <Input
                    type={'text'}
                    name={'cidade'}
                    label={'Cidade'}
                    required={false}
                    minLength={3}
                    maxLength={255}
                    value={data?.cidade ?? ""}
                />
            </div>
        </FormModal>
    )
        ;
}
