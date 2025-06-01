import JSONType from "../misc/JSONType.ts";

export default interface UsuarioRequestData extends JSONType{
    email: string;
    password: string;
    name: string;
    telefone:string;
    gender: string;
    autorizacaoId: number;
}
