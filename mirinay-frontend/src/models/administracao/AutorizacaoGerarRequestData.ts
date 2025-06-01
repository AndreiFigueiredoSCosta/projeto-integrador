import JSONType from "../misc/JSONType.ts";

export default interface AutorizacaoGerarRequestData extends JSONType{
    nome: string;
    descricao: string;
    acoes: number[];
}
