import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useRef} from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import FormModal from "../../../../../../../components/modals/FormModal";
import {TextArea} from "../../../../../../../components/form/textarea/Textarea";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import {Select} from "../../../../../../../components/form/select/Select";
import {SelectOption} from "../../../../../../../types/SelectOption.ts";
import PrioridadeEnum from "../../../../../../../enums/PrioridadeEnum.ts";
import DestinoEnum from "../../../../../../../enums/DestinoEnum.ts";
import RequisicaoRequestData from "../../../../../../../models/requisicao/RequisicaoRequestData.ts";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import Input from "../../../../../../../components/form/input/Input";
import RequisicaoResponseDetailsData from "../../../../../../../models/requisicao/RequisicaoResponseDetailsData.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function RequisicaoDetailsEditModal({hide, setHide}: GrupoDetailsEditModalProps) {
    const requisicaoId = useParams().requisicaoId as unknown as number;
    const { refreshDetails, data } = useDetails();
    const endpoint = `${useEndpoint().requisicao().operacoes(requisicaoId).geral().editar}`;
    const formRef = useRef<HTMLFormElement>(null);
    const dataMapped = data as RequisicaoResponseDetailsData;
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint, {
        method: "PUT"
    });

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const name = formData.get("nome") as string;
        const cliente = formData.get("cliente") as string || "";
        const prioridade = formData.get("prioridade") as PrioridadeEnum;
        const observacao = formData.get("observacao") as string | "";

        const RequestData = {
            nome: name,
            cliente: cliente,
            prioridade: prioridade,
            destino: dataMapped?.destinoEnum,
            observacao: observacao,
            unidadeId: 1
            } as RequisicaoRequestData;

        execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                refreshDetails();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Requisição editada com sucesso.",
            errorMessage: "Erro ao editar a requisição."
        });

    const options: SelectOption[] = [
        {
            value: PrioridadeEnum.COMPRAR,
            label: PrioridadeEnum.COMPRAR
        },
        {
            value: PrioridadeEnum.COTAR,
            label: PrioridadeEnum.COTAR
        }
    ];

    return (
        <FormModal
            title={"Editar Requisição"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input
                type={'text'}
                name={'nome'}
                label={'Nome da Requisicao'}
                required={true}
                value={dataMapped?.nome}
                disabled={isLoading}
            />
            {
                (dataMapped?.destinoEnum === DestinoEnum.VENDA ||
                dataMapped?.destinoEnum === DestinoEnum.VENDA_ESTOQUE) &&
                <Input
                    type={'text'}
                    name={'cliente'}
                    label={'Nome do Cliente'}
                    required={true}
                    value={dataMapped?.cliente}
                    disabled={isLoading}
                />
            }
            <Select
                label={"Prioridade"}
                options={options}
                name={"prioridade"}
                value={options.find(option => option.value === dataMapped?.prioridadeEnum)}
                disabled={isLoading}
                required={true}
            />
            <TextArea
                label={"Observação"}
                name={"observacao"}
                required={false}
                value={dataMapped?.observacao}
                disabled={isLoading}
            />
        </FormModal>
    );
}
