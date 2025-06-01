export default interface AprovacaoDetailsRequestData{
    itemId: number;
    nome: string;
    encontrado: boolean;
    estado: string;
    detalhes: {
        marca: string;
        valor: number;
        quantidade: number;
        observacao: string;
        tempoEntrega: number;
    }
}
