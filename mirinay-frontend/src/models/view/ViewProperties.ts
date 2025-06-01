// Interface para as propriedaddes de uma view, usado para manter em cache certos dados
export default interface ViewProperties {
    limit: number;
    title: string;
    page: number;
    showedItens: number;
    endpoint: string;
    orderBy: string;
}

// Propriedades padrões para uma view
export const defaultViewProperties: ViewProperties = {
    limit: 17,
    title: "",
    page: 0,
    showedItens: 0,
    endpoint: "",
    orderBy: "ID"
};
