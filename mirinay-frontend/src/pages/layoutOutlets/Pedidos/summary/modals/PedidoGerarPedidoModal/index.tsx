import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { useRef, useState, FormEvent } from "react";
import RequestSelect from "../../../../../../components/form/select/RequestSelect";
import FormModal from "../../../../../../components/modals/FormModal";
import { SelectOption } from "../../../../../../types/SelectOption.ts";
import Input from "../../../../../../components/form/input/Input";
import useView from "../../../../../../hooks/useView.ts";
import PedidoGerarRequestData from "../../../../../../models/pedidos/PedidoGerarRequestData.ts";
import { Select } from "../../../../../../components/form/select/Select";
import translateFreteEnum from "../../../../../../utils/translators/translateFreteEnum.ts";
import FreteEnum from "../../../../../../enums/FreteEnum.ts";
import { useMutate } from "../../../../../../hooks/useMutate.ts";
import useToastManager from "../../../../../../hooks/useToastManager.ts";


interface GrupoDetailsEditModalProps {
    hide: boolean;
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void;
    itensIds: number[];
    fornecedorId: number;
}

export default function PedidoGerarPedidoModal({ hide, setHide, itensIds, fornecedorId }: GrupoDetailsEditModalProps) {
    const endpoint = useEndpoint().pedido().POST().gerar;
    const { refreshView } = useView();
    const { success, danger } = useToastManager();
    const formRef = useRef<HTMLFormElement>(null);

    const [selectedTransportadora, setSelectedTransportadora] = useState<SelectOption>();
    const [frete, setFrete] = useState<SelectOption | undefined>(undefined);
    const [selectedUnidade, setSelectedUnidade] = useState<SelectOption>();
    const [selectedCondPgto, setSelectedCondPgto] = useState<SelectOption>();

    selectedCondPgto
    const downloadPdf = (pdfBlob: Blob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pedido.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };
    const { execute, isLoading } = useMutate<Blob>(endpoint, {
        method: "POST",
        responseType: "blob"
    }, {
        onSuccess: (response: Blob) => {
            if (response.type === "application/pdf") {
                downloadPdf(response);
                success("✅ Pedido gerado e baixado com sucesso!");
                setHide(true);
                refreshView();
            } else {
                danger("❌ Resposta inesperada.", "Por favor, tente novamente mais tarde.");
            }
        },
        onError: (error) => {
            console.error("Erro ao gerar pedido:", error);
            danger("❌ Erro ao gerar pedido.", "Por favor, tente novamente mais tarde.");
        }
    });

    const formHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const requestData: PedidoGerarRequestData = {
            cotacaoIds: itensIds,
            condPgto: formData.get("condPgto") as string,
            fornecedorCnpjId: fornecedorId,
            frete: frete?.value as FreteEnum,
            tempoEntrega: formData.get("tempoEntrega") as string,
            transportadorId: selectedTransportadora?.value as number,
            unidadeId: selectedUnidade?.value as number,
        };

        console.log("Enviando requisição com dados:", requestData);
        execute(requestData); // Sem passar funções extras aqui
    };

    const freteOptions: SelectOption[] = [
        { label: translateFreteEnum(FreteEnum.CIF), value: FreteEnum.CIF },
        { label: translateFreteEnum(FreteEnum.FOB), value: FreteEnum.FOB },
        { label: translateFreteEnum(FreteEnum.SEM_FRETE), value: FreteEnum.SEM_FRETE }
    ];

    return (
        <FormModal
            title={"Gerar pedido"}
            setHide={setHide}
            hide={hide}
            onSubmit={(e) => formHandler(e as FormEvent<HTMLFormElement>)} // Corrigido aqui
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Gerar pedido"}
        >
            <div style={{ display: "flex", gap: "10px" }}>
                <Input type={"number"} label={"Tempo de entrega"} name={"tempoEntrega"} required disabled={isLoading} />
                <RequestSelect
                    name={"unidade"}
                    label={"Unidade"}
                    selected={selectedUnidade}
                    onSelect={(value) => setSelectedUnidade(value as SelectOption)}
                    disabled={isLoading}
                    endpoint={(inputValue) => useEndpoint().unidade().select(inputValue)}
                    required
                />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
                <Select
                    label={"Frete"}
                    options={freteOptions}
                    name={"frete"}
                    required
                    disabled={isLoading}
                    onChange={(value) => setFrete(value as SelectOption)}
                    value={frete}
                />
                <RequestSelect
                    name={"condPgto"}
                    label={"Cond. Pagamento"}
                    selected={selectedCondPgto}
                    onSelect={(value) => setSelectedCondPgto(value as SelectOption)}
                    disabled={isLoading}
                    endpoint={(inputValue) => useEndpoint().condicaoPagamento().select(inputValue)}
                    required
                />
            </div>
            <RequestSelect
                name={"transportadora"}
                label={"Transportadora"}
                selected={selectedTransportadora}
                onSelect={(value) => setSelectedTransportadora(value as SelectOption)}
                disabled={isLoading}
                endpoint={(inputValue) => useEndpoint().transportador().buscas(inputValue).select}
                required
            />
        </FormModal>
    );
}
