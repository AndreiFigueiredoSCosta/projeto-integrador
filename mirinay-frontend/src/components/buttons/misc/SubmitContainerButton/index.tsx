import {ActionButton} from "../../action/ActionButton";
import useView from "../../../../hooks/useView.ts";

interface ModalButtonProps{
    submitText?: string;
    size?: "small" | "large";
}

export default function SubmitContainerButton({ submitText = "Cadastrar", size = "large"} : ModalButtonProps){
    const context = useView();

    let variant: "submit" | "cancel";
    let text: string;

    if (!context.isSubmitContainerVisible){
        variant = "submit";
        text = submitText;
    }
    else{
        variant = "cancel";
        text = "Fechar";
    }

    return (
        <ActionButton variant={variant}
                      onClick={() => {
                          context.setIsSubmitContainerVisible((prevState) => {
                              return !prevState;
                          });
                      }}
                      size={size}
                      upper={true}>
            {text}
        </ActionButton>
    );
}
