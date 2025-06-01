import { ReactNode, useState} from "react";
import ToastContext from "../ToastContext";

export interface ToastProps {
    key: string;
    title: string;
    message: string;
    variant: 'success' | 'warning' | 'danger';
}

export default function ToastProvider({ children }: { children: ReactNode }) {
    const [toastList, setToastList] = useState<ToastProps[]>([]);

    const throwToast = (
        title: string,
        message: ReactNode,  // <-- Aqui precisa ser ReactNode, não string
        variant: 'success' | 'warning' | 'danger',
        expires = true
    ): void => {
        const key = `toast-${Date.now()}`;

        setToastList((prevState) => [
            ...prevState,
            { key, title, message, variant } as ToastProps,
        ]);

        if (expires) {
            setTimeout(() => {
                setToastList((prevState) =>
                    prevState.filter((toast) => toast.key !== key)
                );
            }, 5000);
        }
    };

    const closeToast = (key: string): void => {
        setToastList((prevState) => prevState.filter((toast) => toast.key !== key));
    };

    return (
        <ToastContext.Provider value={{ toastList, throwToast, closeToast }}>
            {children}
        </ToastContext.Provider>
    );
}
