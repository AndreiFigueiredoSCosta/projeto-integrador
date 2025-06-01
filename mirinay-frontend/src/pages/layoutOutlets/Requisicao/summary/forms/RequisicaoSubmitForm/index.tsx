import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { useRef} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import {TextArea} from "../../../../../../components/form/textarea/Textarea";
import useView from "../../../../../../hooks/useView.ts";
import {SelectOption} from "../../../../../../types/SelectOption.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import RequisicaoRequestData from "../../../../../../models/requisicao/RequisicaoRequestData.ts";
import PrioridadeEnum from "../../../../../../enums/PrioridadeEnum.ts";
import DestinoEnum from "../../../../../../enums/DestinoEnum.ts";
import RequisicaoDestinoTrader from "../../../components/RequisicaoDestinoTrader";
import {Select} from "../../../../../../components/form/select/Select";

/**
 * Formulário de submissão de Requisicao
 * @constructor
 */
export default function RequisicaoSubmitForm(){
    const { isSubmitContainerVisible, refreshView } = useView();
    const endpoint = `${useEndpoint().requisicao().operacoes(0).geral().cadastrar}`;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const name = formData.get("nome") as string;
        const cliente = formData.get("cliente") as string;
        const prioridade = formData.get("prioridade") as PrioridadeEnum;
        const destino = formData.get("destino") as DestinoEnum;
        const observacao = formData.get("observacao") as string | "";
        const unidade = formData.get("unidade") as unknown as number;
        const RequestData = {
                nome: name,
                cliente: cliente,
                prioridade: prioridade,
                destino: destino,
                observacao: observacao,
                unidadeId: unidade
            } as RequisicaoRequestData;

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
            successMessage: "Requisição cadastrada com sucesso.",
            errorMessage: "Erro ao cadastrar requisição."
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
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <RequisicaoDestinoTrader />
            <Select label={"Prioridade"} options={options} name={"prioridade"}/>
            <TextArea label={"Observação"} name={"observacao"} required={false} />
        </SubmitContainer>
    );
}
