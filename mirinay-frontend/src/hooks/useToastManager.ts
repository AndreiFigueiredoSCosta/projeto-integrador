import {ReactNode, useState} from "react";
import useToast from "./useToast.ts";

/**
 * Hook que retorna um objeto com funções para criar toasts
 */
export default function useToastManager() {
    const context = useToast();
    const [ toastManager ] = useState({
            /**
             * Função que cria um toast de sucesso
             * @param title - titulo do toast
             * @param message - conteudo do toast
             * @param expires - se o toast deve expirar após 5s
             */
            success: (title: string, message?: ReactNode, expires?: boolean) => {
                return context.throwToast(title, message, 'success', expires);
            },
            /**
             * Função que cria um aviso de aviso (¬¬)
             * @param title - titulo do toast
             * @param message - conteudo do toast
             * @param expires - se o toast deve expirar após 5s
             */
            warning: (title: string, message: ReactNode, expires?: boolean) => {
                return context.throwToast(title, message, 'warning', expires);
            },
            /**
             * Função que cria um aviso de perigo
             * @param title - titulo do toast
             * @param message - conteudo do toast
             * @param expires - se o toast deve expirar após 5s
             */
            danger: (title: string, message: ReactNode, expires?: boolean) => {
                return context.throwToast(title, message, 'danger', expires);
            }
        });

    return toastManager;
}
