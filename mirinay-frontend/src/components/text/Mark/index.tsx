import "../styles/textStyle.css";
import "./style.css";

/**
 * Componente usado para destacar um texto
 * @param children - Conteúdo a ser destacado
 * @param color - Cor do destaque (green, yellow, red)
 */
export function Mark({ children, color = "green" } : { children? : React.ReactNode; color? : string } ){
    const validColors = ["green", "yellow", "red"];
    if (!validColors.includes(color)){
        console.error(`Invalid color: ${color}`);
        color = "green";
    }

    return (
        <mark className={`mark mark-${color}`}>{ children }</mark>
    );
}
