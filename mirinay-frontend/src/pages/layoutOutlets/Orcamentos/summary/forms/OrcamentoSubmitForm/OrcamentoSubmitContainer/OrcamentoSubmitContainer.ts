type OrcamentoSubmitContainerProps = {
    children?: React.ReactNode,
    hide?: boolean,
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void,
    formRef?: React.RefObject<HTMLFormElement>,
    isLoading?: boolean,
    btnText?: string,
    hasDefaultForm?: boolean,
    isButtonDisabled?: boolean
};

/*

export function OrcamentoSubmitContainer({
    children,
    hide = false,
    onSubmit,
    formRef,
    isLoading = false,
    hasDefaultForm = true,
    btnText = "cadastrar",
    isButtonDisabled = false
}: OrcamentoSubmitContainerProps){
    
    
    return (

    );
}

*/