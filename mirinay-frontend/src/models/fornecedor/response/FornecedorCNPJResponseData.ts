import MatrizFilialEnum from "../../../enums/MatrizFilialEnum.ts";

export default interface FornecedorCNPJResponseData {
    id: number,
    nome: string,
    cnpj: string,
    tipo: MatrizFilialEnum,
    estado: string,
    cidade: string,
    telefone: string,
    email: string,
}
