import RequisicaoConstrucaoResponseData
    from "../../../../../../../../models/requisicao/construcao/RequisicaoConstrucaoResponseData.ts";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import {useParams} from "react-router-dom";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useRef} from "react";
import {TextArea} from "../../../../../../../../components/form/textarea/Textarea";
import FormModal from "../../../../../../../../components/modals/FormModal/index.tsx";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import RequisicaoCotacaoAlertRequestData
    from "../../../../../../../../models/requisicao/cotacao/RequisicaoCotacaoAlertRequestData.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data?: RequisicaoConstrucaoResponseData
}

export default function RequisicaoCotacaoAlertModal({hide, setHide, data}: GrupoDetailsEditModalProps) {
    const id = useParams().requisicaoId as unknown as number;
    const { refreshDetails } = useDetails();
    const { refreshView } = useView();
    const endpoint = useEndpoint().requisicao().operacoes(id).cotacao().addAlerta;
    const formRef = useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(endpoint, {
        method: "POST"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const alerta = formData.get("alerta") as string;


        const RequestData = {
            itemId: data?.itemId,
            alerta: alerta
        } as RequisicaoCotacaoAlertRequestData;

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
            successMessage: "Alerta adicionado com sucesso.",
            errorMessage: "Erro ao adicionar um alerta a esse item."
        });

    return (
        <FormModal
            title={"Adicionar alerta"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Adicionar"}
        >
            <TextArea
                label={"Alerta"}
                name={"alerta"}
                required={true}
                minLength={3}
                maxLength={255}
                disabled={isLoading}
            />
        </FormModal>
    )
        ;
}
