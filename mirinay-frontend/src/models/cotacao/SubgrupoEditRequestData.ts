export default interface SubgrupoEditRequestData extends Record<string | symbol, unknown> {
    id: number,
    nome: string,
    descricao: string,
    grupo: {
        id: number,
    }
}
