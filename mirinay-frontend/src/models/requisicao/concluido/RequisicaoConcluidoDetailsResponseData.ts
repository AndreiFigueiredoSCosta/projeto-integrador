import EstadoEnum from "../../../enums/EstadoEnum.ts";

export default interface RequisicaoConcluidoDetailsResponseData {
    itemId: number
    nome: string
    estado: EstadoEnum
    detalhes: {
        marca: string
        valor: number
        quantidade: number
        observacao: string
        tempoEntrega: number
    }
}
