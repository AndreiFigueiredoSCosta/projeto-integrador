import JSONType from "../../misc/JSONType.ts";

export default interface ProdutoRequestData extends JSONType {
    nome: string;
    subgrupoId: number;
    unidadeId: number;
    descricao: string;
}
