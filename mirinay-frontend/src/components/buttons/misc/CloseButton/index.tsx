import './style.css';
import {CloseIcon} from "../../../../assets/CloseIcon";

/**
 * Botao em formato de X utilizado para fechar
 * @param onClick Função a ser executada ao clicar no botão
 * @param variant Tamanho do botão (small, medium, large)
 */

export function CloseButton({ onClick, variant } : {onClick?: () => void, variant: "small" | "medium" | "large"} ) {
  return (
      <button type={"button"} onClick={onClick} className={`close-button close-button-${variant}`}>
          <CloseIcon/>
      </button>
  )
}
