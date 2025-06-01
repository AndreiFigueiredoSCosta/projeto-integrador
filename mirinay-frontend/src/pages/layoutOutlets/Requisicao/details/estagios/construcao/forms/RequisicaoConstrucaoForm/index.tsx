import RequisicaoConstrucaoRequestData
    from "../../../../../../../../models/requisicao/construcao/RequisicaoConstrucaoRequestData.ts";
import Input from "../../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../../components/form/textarea/Textarea";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useRef} from "react";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import {SubmitContainer} from "../../../../../../../../components/misc/SubmitContainer";
import {Select} from "../../../../../../../../components/form/select/Select";
import DestinoEnum from "../../../../../../../../enums/DestinoEnum.ts";
import translateDestinoEnum from "../../../../../../../../utils/translators/translateDestinoEnum.ts";
import useDetails from "../../../../../../../../hooks/useDetails.ts";

/**
 * Formulário de submissão de grupo/subgrupo
 * @constructor
 */
export default function RequisicaoConstrucaoForm(){
    const { refreshView, isSubmitContainerVisible } = useView();
    const { refreshDetails } = useDetails()
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().requisicao().operacoes(id).construcao().inserir;
    const formRef = useRef<HTMLFormElement>(null);
    const mappedData = useDetails().data as RequisicaoConstrucaoRequestData;
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const referencia = formData.get("referencia") as string;
        const quantidade = formData.get("quantidade") as unknown as number;
        const observacao = formData.get("observacao") as string;
        const destino = formData.get("destino") as string;

        const RequestData = {
            referencia: referencia,
            quantidade: quantidade,
            observacao: observacao,
            destino: destino
        } as RequisicaoConstrucaoRequestData;

        execute(RequestData);
    }

    const handleSubmit = useFormHandler({
        formRef,
        isSuccess,
        onSuccess: () => {
            refreshView();
            refreshDetails();
        },
        isError,
        error,
        formHandler: formHandler,
        successMessage: "Item inserido com sucesso.",
        errorMessage: "Erro ao inserir item."
    })

    const options = [
        { value: DestinoEnum.VENDA, label: translateDestinoEnum(DestinoEnum.VENDA) },
        { value: DestinoEnum.ESTOQUE, label: translateDestinoEnum(DestinoEnum.ESTOQUE) },
    ];

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <Input
                type={'text'}
                name={'referencia'}
                label={'Referência'}
                required={true}
                minLength={3}
                maxLength={255}
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
                    isSearchable={false}
                    value={options.filter(option => option.value === mappedData?.destino)[0] || null}
                    disabled={isLoading || mappedData?.destino === DestinoEnum.ESTOQUE}
                />
                <Input
                    type={'number'}
                    name={'quantidade'}
                    label={'Quantidade'}
                    required={true}
                    min={1}
                    disabled={isLoading}
                />
            </div>
            <TextArea
                label={"Observação"}
                name={"observacao"}
                required={false}
                minLength={3}
                maxLength={255}
                disabled={isLoading}
            />
        </SubmitContainer>
    );
}
