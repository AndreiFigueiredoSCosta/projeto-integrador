import JSONType from "../misc/JSONType.ts";

export default interface MargemDTO extends JSONType {
    margemId?: number,
    nome: string,
    valor: number
}
