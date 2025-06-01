import EstadoEnum from "../../enums/EstadoEnum.ts";
import DestinoEnum from "../../enums/DestinoEnum.ts";

export default interface GetItensDTO{
    itemId: number,
    produtoId: number,
    encontrado: boolean,
    estado: EstadoEnum,
    referencia: string,
    nomeProduto: string,
    marca: string,
    valorUnitario: number,
    quantidade: number,
    tempoEntrega: number,
    prevEntrega: string,
    observacao: string,
    unidadeProduto: string,
    destino: DestinoEnum
}
