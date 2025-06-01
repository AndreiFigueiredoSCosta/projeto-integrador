import "./style.css"

/**
 * Componente de elemento obrigatório
 * @param isRequired - boolean - se o elemento é obrigatório
 */
export function RequiredElement({isRequired = false}: {isRequired: boolean}) {
    if (!isRequired) {
        return null;
    }

    return (
        <p className={`required-element bold`}>*</p>
    )
}
