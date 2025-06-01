import JSONType from "../../misc/JSONType.ts";

export default interface GrupoEditRequestData extends JSONType {
    grupoId: number,
    nome: string,
    descricao: string
}
