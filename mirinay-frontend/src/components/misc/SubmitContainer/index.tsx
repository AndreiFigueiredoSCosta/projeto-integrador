import './styles.css'
import {ActionButton} from '../../buttons/action/ActionButton';
import {Bar} from '../../table/components/Bar';
import React, {useEffect, useState} from "react";
import {Loading} from "../Loading";
import RequiredWarning from "../RequiredWarning";

type SubmitContainerProps = {
    children?: React.ReactNode,
    size?: 'large' | 'small',
    hide?: boolean,
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void,
    formRef?: React.RefObject<HTMLFormElement>,
    isLoading?: boolean,
    btnText?: string,
    hasDefaultForm?: boolean,
    isButtonDisabled?: boolean
};

/**
 * Componente usado para troca de visão de um conteúdo para outro
 * @param children - Conteúdo do formulário do SubmitContainer
 * @param size - (large, small) - Varia o tamanho do SubmitContainer
 * @param onSubmit - Função a ser realizada ao enviar o formulario do SubmitContainer
 * @param hide - Define se o SubmitContainer está visível ou não
 * @param formRef - Referência do formulário do SubmitContainer
 * @param isLoading - Define se o SubmitContainer está carregando
 * @param hasDefaultForm - Define se o SubmitContainer possui um formulário padrão
 * @param btnText - Texto do botão do SubmitContainer
 * @param isButtonDisabled - Define se o botão do SubmitContainer está desabilitado
 */

export function SubmitContainer({
                                    children,
                                    size = "large",
                                    hide = false,
                                    onSubmit,
                                    formRef,
                                    isLoading = false,
                                    hasDefaultForm = true,
                                    btnText = "cadastrar",
                                    isButtonDisabled = false
                                }: SubmitContainerProps) {
    const [display, setDisplay] = useState('none');


    useEffect(() => {
        if (hide) {
            setTimeout(() => setDisplay('none'), 300);
        } else {
            setDisplay('block');
        }
    }, [hide]);

    const content = (
        <>
            <RequiredWarning/>
            <div className={`submitContainer-form submitContainer-${size}`}>
                {children}
            </div>
            <ActionButton variant='submit' type={"submit"} disabled={isLoading || isButtonDisabled} size={size}>
                {
                    !isLoading ? btnText : <Loading/>
                }
            </ActionButton>
        </>
    )

    return (
        <div className={`submitContainer ${hide ? 'hide' : 'show'} ${size}`} style={{display: display}}>
            <Bar variant='upper' size={"small"}/>
            {
                hasDefaultForm ?
                    <form className={`submitContainer-box ${hide ? 'hide' : 'show'} submitContainer-${size}`}
                          onSubmit={onSubmit} ref={formRef}>
                        {content}
                    </form>
                    :
                    <div className={`submitContainer-box ${hide ? 'hide' : 'show'} submitContainer-${size}`}>
                        {content}
                    </div>
            }
            <Bar variant='lower' size={"small"}/>
        </div>
    );
}
