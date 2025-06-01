import JSONType from "../../misc/JSONType.ts";
import MatrizFilialEnum from "../../../enums/MatrizFilialEnum.ts";

export default interface FornecedorCNPJRequestData extends JSONType{
    id?: number;
    nome: string;
    cnpj:string;
    estado:string;
    cidade:string;
    telefone:string;
    email: string;
    tipo: MatrizFilialEnum;
    fornecedorId: number;
    pedidoMinimo: number;
}
