import JSONType from "../misc/JSONType";

export interface ClienteDTO extends JSONType{
    clienteId? : number,
    nomeCompleto : string,
    cpf : string,
    email : string,
    telefone: string,
    nascimento: string
}