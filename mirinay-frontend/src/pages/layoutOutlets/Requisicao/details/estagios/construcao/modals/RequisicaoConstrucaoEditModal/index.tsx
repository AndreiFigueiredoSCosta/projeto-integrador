import RequisicaoConstrucaoResponseData
    from "../../../../../../../../models/requisicao/construcao/RequisicaoConstrucaoResponseData.ts";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import {useParams} from "react-router-dom";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useRef} from "react";
import RequisicaoConstrucaoRequestData
    from "../../../../../../../../models/requisicao/construcao/RequisicaoConstrucaoRequestData.ts";
import Input from "../../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../../components/form/textarea/Textarea";
import FormModal from "../../../../../../../../components/modals/FormModal/index.tsx";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import {Select} from "../../../../../../../../components/form/select/Select";
import DestinoEnum from "../../../../../../../../enums/DestinoEnum.ts";
import translateDestinoEnum from "../../../../../../../../utils/translators/translateDestinoEnum.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data?: RequisicaoConstrucaoResponseData
}

export default function RequisicaoConstrucaoEditModal({hide, setHide, data}: GrupoDetailsEditModalProps) {
    const id = useParams().requisicaoId as unknown as number;
    const { refreshDetails } = useDetails();
    const { refreshView } = useView();
    const editEndpoint = useEndpoint().requisicao().operacoes(id).construcao().editar;
    const formRef = useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(editEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const referencia = formData.get("referencia") as string;
        const quantidade = formData.get("quantidade") as unknown as number;
        const observacao = formData.get("observacao") as string;
        const destino = formData.get("destino") as string;

        const RequestData = {
            itemId: data?.itemId,
            referencia: referencia,
            quantidade: quantidade,
            observacao: observacao,
            destino: destino,
        } as RequisicaoConstrucaoRequestData;

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
            successMessage: "Item editado com sucesso.",
            errorMessage: "Erro ao editar o item."
        });

    const options = [
        { value: DestinoEnum.VENDA, label: translateDestinoEnum(DestinoEnum.VENDA) },
        { value: DestinoEnum.ESTOQUE, label: translateDestinoEnum(DestinoEnum.ESTOQUE) },
    ];

    return (
        <FormModal
            title={"Editar Item"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input
                type={'text'}
                name={'referencia'}
                label={'Referência'}
                required={true}
                minLength={3}
                maxLength={255}
                value={data?.referencia || ""}
                disabled={isLoading}
            />
            <div style={{
                display: 'flex',
                gap: '10px'
            }}>
                <Select
                    label={"Destino"}
                    options={options}
                    name={"destino"}
                    isLoading={isLoading}
                    required={true}
                    disabled={isLoading}
                    value={options.filter(option => option.value === data?.destino)[0]}
                />
                <Input
                    type={'number'}
                    name={'quantidade'}
                    label={'Quantidade'}
                    required={true}
                    minLength={3}
                    maxLength={255}
                    value={data?.quantidade as unknown as string || "0"}
                    disabled={isLoading}
                />
            </div>
            <TextArea
                label={"Observação"}
                name={"observacao"}
                required={false}
                value={data?.observacao || ""}
                minLength={3}
                maxLength={255}
                disabled={isLoading}
            />
        </FormModal>
    )
        ;
}
