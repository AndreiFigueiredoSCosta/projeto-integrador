import JSONType from "../../../misc/JSONType.ts";

export default interface CotacaoRevisaoFornecedorRequestData extends JSONType{
    itemId?: number,
    fornecedorId: number,
    cnpjIds: number[]
}
