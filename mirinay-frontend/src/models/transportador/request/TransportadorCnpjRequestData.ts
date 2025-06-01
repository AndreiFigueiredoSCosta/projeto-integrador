import JSONType from "../../misc/JSONType.ts";
import MatrizFilialEnum from "../../../enums/MatrizFilialEnum.ts";

export default interface TransportadorCnpjRequestData extends JSONType {
    nome: string;
    cnpj: string;
    telefone: string;
    email: string;
    celular: string;
    tipo: MatrizFilialEnum;
}
