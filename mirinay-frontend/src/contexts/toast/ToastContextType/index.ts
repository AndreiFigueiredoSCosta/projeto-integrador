import {ToastProps} from "../ToastProvider";
import React from "react";

/**
 * Interface que define o formato do contexto de toasts.
 */
export default interface ToastContextType {
    toastList: ToastProps[];
    throwToast: (
        title: string,
        message: React.ReactNode,
        variant: "success" | "warning" | "danger",
        expires?: boolean | undefined
    ) => void;
    closeToast: (key: string) => void;
}
