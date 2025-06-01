import {createContext} from "react";
import ToastContextType from "../ToastContextType";

/**
 * Contexto de toasts.
 */
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export default ToastContext;
