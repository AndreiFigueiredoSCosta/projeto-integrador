import JSONType from "../../misc/JSONType.ts";

export default interface ClonagemProdutoRequestData extends JSONType{
    clonagemId: number,
    similares: number[]
}
