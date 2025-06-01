export default interface DeleteRequestData extends Record<string | symbol, unknown>{
    idToDelete?: number;
    motivo: string;
}
