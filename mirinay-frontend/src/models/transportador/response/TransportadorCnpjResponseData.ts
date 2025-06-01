import MatrizFilialEnum from "../../../enums/MatrizFilialEnum.ts";

export default interface TransportadorCnpjResponseData {
    transportadorCnpjId: number;
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    celular: string;
    tipo: MatrizFilialEnum;
}
