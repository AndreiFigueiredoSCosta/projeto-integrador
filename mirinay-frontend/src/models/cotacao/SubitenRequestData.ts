export default interface SubitenRequestData extends Record<string | symbol, unknown>{
    grupo: {
        id: number,
    },
    nome: string,
    descricao: string
}
