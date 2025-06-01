import "./style.css"
import {Toast} from "../Toast";
import useToast from "../../../hooks/useToast.ts";

export default function ToastContainer(){
    const { toastList } = useToast();

    if (!toastList.length) {
        return null;
    }

    return (
        <div className="toast-container">
            {
                toastList.map((toastProps) => {
                    return (
                        <Toast key={toastProps.key} index={toastProps.key} variant={toastProps.variant} title={toastProps.title}>
                            {toastProps.message}
                        </Toast>
                    );
                })
            }
        </div>
    );
}
