import JSONType from "../../misc/JSONType.ts";

export default interface ClonagemFornecedorRequestData extends JSONType{
    clonagemId: number,
    fornecedorId: number
}
