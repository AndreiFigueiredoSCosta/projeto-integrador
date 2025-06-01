import JSONType from "../../../misc/JSONType.ts";

export default interface CotacaoRevisaoSimilarRequestData extends JSONType{
    itemId: number,
    referencia: string,
    produtoId: number,
    observacao: string,
    marcaId: number
}
