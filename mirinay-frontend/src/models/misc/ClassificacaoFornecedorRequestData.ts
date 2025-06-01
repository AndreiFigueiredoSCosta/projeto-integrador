import JSONType from "./JSONType.ts";

export default interface ClassificacaoFornecedorRequestData extends JSONType {
    cotacaoId: number
    valorClassificacao: number
    motivo: string
    fornecedorId: number
}
