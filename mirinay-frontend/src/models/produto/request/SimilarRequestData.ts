import JSONType from "../../misc/JSONType.ts";

export default interface SimilarRequestData extends JSONType{
    idMarca: number;
    referencia: string;
    observacao: string;
}
