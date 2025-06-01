import JSONType from "../../../misc/JSONType.ts";

export default interface CotacaoRevisaoProdutoRequestData extends JSONType{
    itemId: number,
    referencia: string,
    nomeProduto: string,
    descricao: string,
    observacao: string,
    subgrupoId: number,
    unidadeId: number,
    marcaId: number
}
