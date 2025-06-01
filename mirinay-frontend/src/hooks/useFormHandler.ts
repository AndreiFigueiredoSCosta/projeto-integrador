import React, {FormEvent, useEffect, useRef} from "react";
import useToastManager from "./useToastManager.ts";
import {useErrorHandling} from "./useErrorHandling.ts";

type useFormHandlerProps = {
    formRef: React.RefObject<HTMLFormElement>,
    onSuccess?: () => void,
    formHandler: (formData: FormData) => void,
    isSuccess: boolean,
    successMessage: string,
    errorMessage: string,
    isError: boolean,
    error: Error | null
}

/**
 * Hook para lidar com a submissão de formulários
 * @param formRef Referência do formulário
 * @param formHandler Função que lida com a submissão do formulário
 * @param isSuccess Indica se a requisição foi bem sucedida
 * @param onSuccess Função a ser executada em caso de sucesso
 * @param successMessage Mensagem de sucesso
 * @param isError Indica se houve um erro
 * @param error Objeto de erro
 * @param errorMessage Mensagem de erro
 */
export default function useFormHandler({
                                           formRef,
                                           onSuccess = () => {},
                                           isSuccess,
                                           isError,
                                           error,
                                           formHandler,
                                           successMessage,
                                           errorMessage}
                                           : useFormHandlerProps) : (e?: FormEvent) => void {
    const toastManager = useToastManager();

    const onSuccessRef = useRef(onSuccess);
    const formHandlerRef = useRef(formHandler);

    // Atualiza as referências
    useEffect(() => {
        onSuccessRef.current = onSuccess;
    }, [onSuccess]);
    useEffect(() => {
        formHandlerRef.current = formHandler;
    }, [formHandler]);

    // Trata a submissão do formulário
    const handleSubmit = (e?: FormEvent) => {
        e?.preventDefault();

        if (formRef.current){
            const formData = new FormData(formRef.current);

            formHandlerRef.current(formData);
        }
    }

    // Trata o sucesso da requisição
    useEffect(() => {
        if (isSuccess){
            toastManager.success(successMessage, true);
            onSuccessRef.current();
        }
    }, [isSuccess, toastManager, successMessage, onSuccessRef]);

    // Trata erros
    useErrorHandling(isError, error, errorMessage);

    return handleSubmit;
}
