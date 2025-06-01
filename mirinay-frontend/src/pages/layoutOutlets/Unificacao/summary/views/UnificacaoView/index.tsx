import ViewContainer from "../../../../../../components/view/ViewContainer";
import UnificacaoKanban  from "../../tables/UnificacaoKanban";
import UnificacaoSubmitForm from "../../forms/UnificacaoSubmitForm";
import {UnificacaoResponseData} from "../../../../../../models/unificacao/UnificacaoResponseData.ts";
import {useRef} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import PrioridadeEnum from "../../../../../../enums/PrioridadeEnum.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import useView from "../../../../../../hooks/useView.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";

interface UnificacaoRequestData extends Record<string | symbol, unknown> {
    nome: string;
    prioridade: PrioridadeEnum;
    observacao?: string;
    itens: number[];
}

/**
 * Gerencia a comunicação entre os componentes da view de Unificacao
 * @constructor
 */
export default function UnificacaoView({selectedItens, handleSelect, setSelectedItens}: {
    selectedItens?: number[],
    handleSelect: (data: UnificacaoResponseData) => void,
    setSelectedItens: (value: (((prevState: (number[] | undefined)) => (number[] | undefined)) | number[] | undefined)) => void
}){
    const { refreshView } = useView();
    const formRef = useRef<HTMLFormElement>(null);
    const endpoint = `${useEndpoint().unificacao().unificar}`;
    const {isLoading, isError, error, execute, isSuccess} = useMutate(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const name = formData.get("nome") as string;
        const prioridade = formData.get("prioridade") as PrioridadeEnum;
        const observacao = formData.get("observacao") as string | "";

        const RequestData = {
            nome: name,
            prioridade: prioridade,
            observacao: observacao,
            itens: selectedItens,
        } as UnificacaoRequestData;

        execute(RequestData);
    }

    const handleSubmit = useFormHandler({
            formRef,
            isSuccess,
            onSuccess: () => {
                setSelectedItens([]);
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Unificação efetuada com sucesso.",
            errorMessage: "Erro ao efetuar unificação."
        });
    return (
        <ViewContainer>
            <UnificacaoKanban handleSelect={handleSelect}/>
            <form onSubmit={handleSubmit} ref={formRef}>
                <UnificacaoSubmitForm
                    selectedItens={selectedItens} isLoading={isLoading}
                />
            </form>
        </ViewContainer>
);
}
