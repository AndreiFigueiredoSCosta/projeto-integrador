import Input from "../../../../../../../../components/form/input/Input";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import {useRef, useState} from "react";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import {SubmitContainer} from "../../../../../../../../components/misc/SubmitContainer";
import useDetails from "../../../../../../../../hooks/useDetails.ts";
import CotacaoCotacaoCotacaoResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoCotacaoResponseData.ts";
import CotacaoCotacaoFornecedorItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoFornecedorItemResponseData.ts";
import {SelectOption} from "../../../../../../../../types/SelectOption.ts";
import CotacaoCotacaoRequestData from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoRequestData.ts";
import Switch from "../../../../../../../../components/form/misc/Switch";
import RequestSelect from "../../../../../../../../components/form/select/RequestSelect";
import CotacaoCotacaoItemResponseData
    from "../../../../../../../../models/cotacao/cotacao/CotacaoCotacaoItemResponseData.ts";

interface CotacaoCotacaoFormProps {
    cotacao?: CotacaoCotacaoCotacaoResponseData | CotacaoCotacaoFornecedorItemResponseData
    item?: CotacaoCotacaoItemResponseData
}

/**
 * Formulário de submissão de grupo/subgrupo
 * @constructor
 */
export default function CotacaoCotacaoForm({
                                               cotacao,
                                               item}
                                               : CotacaoCotacaoFormProps) {
    const {refreshView, isSubmitContainerVisible} = useView();
    const {refreshDetails} = useDetails();
    const id = useParams().requisicaoId as unknown as number;
    const endpoint = useEndpoint().cotacao().PUT().cotacao(id).cotar(0, cotacao?.cotacaoId as number);
    const formRef = useRef<HTMLFormElement>(null);
    const [ selectedMargem, setSelectedMargem ] = useState<SelectOption | null>(null);
    const {isLoading, isError, error, execute, isSuccess} = useMutate<CotacaoCotacaoRequestData>(endpoint, {
        method: 'PUT'
    });
    const selectedValue =
        ((cotacao && cotacao as CotacaoCotacaoCotacaoResponseData)?.nomeFornecedor)
            ?
            `${(cotacao as CotacaoCotacaoCotacaoResponseData)?.nomeFornecedor}`
            :
            (cotacao as CotacaoCotacaoFornecedorItemResponseData)?.referencia ?
                `${(cotacao as CotacaoCotacaoFornecedorItemResponseData)?.referencia} (${(cotacao as CotacaoCotacaoFornecedorItemResponseData)?.quantidadeItem})`
                :
                "";


    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const quantidade = formData.get('quantidade') as unknown as number;
        const valorUnitario = formData.get('valorUnitario') as unknown as number;
        const ipi = formData.get('ipi') as unknown as number;
        const st = formData.get('st') as unknown as number;
        const difal = formData.get('difal') as unknown as string;
        const difalBool = difal === 'on';
        const tempoEntrega = formData.get('tempoEntrega') as unknown as number;

        const RequestData = {
            quantidade,
            valorUnitario,
            ipi,
            st,
            difal: difalBool,
            margemId: selectedMargem?.value as number,
            tempoEntrega
        } as CotacaoCotacaoRequestData;

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

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
                         size={"small"}
                         isButtonDisabled={!cotacao}
                         btnText={"Cotar"}
        >
            <Input
                label={"Cotação"}
                name={"cotacao"}
                required={true}
                disabled={true}
                value={selectedValue}
                type={"text"}
            />
            <div style={{
                display: 'flex',
                gap: '10px',
                justifyItems: 'center',
                alignItems: 'center'
            }}>
                <Input
                    label={"Quantidade"}
                    name={"quantidade"}
                    type={"number"}
                    required={true}
                    min={1}
                    max={(item as CotacaoCotacaoItemResponseData)?.quantidade ?? (cotacao as CotacaoCotacaoFornecedorItemResponseData)?.quantidadeItem}
                    step={1}
                    disabled={isLoading}
                />
                <Input
                    label={"Valor unitário"}
                    name={"valorUnitario"}
                    type={"number"}
                    required={true}
                    min={0}
                    step={0.01}
                    disabled={isLoading}
                />
            </div>
            <div style={{
                display: 'flex',
                gap: '10px'
            }}>
                <Input
                    label={"IPI (%)"}
                    name={"ipi"}
                    type={"number"}
                    required={true}
                    min={0}
                    max={100}
                    step={0.01}
                    disabled={isLoading}
                />
                <Input
                    label={"ST (%)"}
                    name={"st"}
                    type={"number"}
                    required={true}
                    min={0}
                    max={100}
                    step={0.01}
                    disabled={isLoading}
                />
                <Switch name={"difal"} disabled={isLoading}>
                    difal
                </Switch>
            </div>
            <div style={{
                display: 'flex',
                gap: '10px'
            }}>
                <RequestSelect
                    label={"Margem"}
                    name={"margem"}
                    required={true}
                    endpoint={(inputValue) => useEndpoint().margem().GET().SEARCH(inputValue).select}
                    disabled={isLoading}
                    selected={selectedMargem}
                    onSelect={(value) => setSelectedMargem(value)}
                />
                <Input
                    label={"Tempo de entrega (dias)"}
                    name={"tempoEntrega"}
                    type={"number"}
                    required={true}
                    min={0}
                    step={1}
                    disabled={isLoading}
                />
            </div>
        </SubmitContainer>
    );
}
