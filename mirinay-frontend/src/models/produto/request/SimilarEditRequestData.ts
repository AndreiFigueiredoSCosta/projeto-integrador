import JSONType from "../../misc/JSONType.ts";

export default interface SimilarEditRequestData extends JSONType{
    idMarca: number;
    referencia: string;
    observacao: string;
}
