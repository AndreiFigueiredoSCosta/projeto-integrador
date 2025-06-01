import {useEffect, useState} from "react";
import useToastManager from "./useToastManager.ts";

/**
 * Hook para lidar com erros de requisição
 * @param isError - Se houve erro
 * @param error - O erro
 * @param message - Mensagem a ser exibida
 */
export function useErrorHandling(isError: boolean, error: Error | null, message: string){
    const [ hasError, setHasError ] = useState(false);
    const toastManager = useToastManager();

    // Garante que não entre em um looping infinito
    useEffect(() => {
        if (isError){
            setHasError(true);
        }
    }, [isError]);

    // Error handler
    useEffect(() => {
        if (hasError){
            toastManager.danger(message, (error ? error.message : "Erro desconhecido"));
            setHasError(false);
        }
    }, [hasError, toastManager, error, message]);
}
