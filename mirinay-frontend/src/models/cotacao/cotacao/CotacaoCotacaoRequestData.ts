import JSONType from "../../misc/JSONType.ts";

export default interface CotacaoCotacaoRequestData extends JSONType {
    quantidade: number;
    valorUnitario: number;
    ipi: number;
    st: number;
    difal: boolean;
    margemId: number;
    tempoEntrega: number;
}
