import {format, parseISO} from "date-fns";

export default function formatToDate(data?: string | null): string {
    if (!data) return "—"; // Retorna traço caso a data seja nula ou indefinida
    return format(parseISO(data), 'dd/MM/yyyy');
}
