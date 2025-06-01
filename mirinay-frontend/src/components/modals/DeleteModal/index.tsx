import {useNavigate} from "react-router-dom";
import {useMutate} from "../../../hooks/useMutate.ts";
import React, {ReactNode} from "react";
import DeleteRequestData from "../../../models/misc/DeleteRequestData.ts";
import useFormHandler from "../../../hooks/useFormHandler.ts";
import {ModalContainer} from "../components/ModalContainer";
import {P} from "../../text/P";
import {CloseButton} from "../../buttons/misc/CloseButton";
import {TextArea} from "../../form/textarea/Textarea";
import {ActionButton} from "../../buttons/action/ActionButton";
import {Loading} from "../../misc/Loading";
import "./style.css";

interface DetailsDeleteModalProps {
    hide: boolean,
    setHide: React.Dispatch<React.SetStateAction<boolean>>,
    request: string,
    redirect?: string,
    errorMessage: string,
    successMessage: string,
    children?: ReactNode,
    onDelete?: () => void,
    idToDelete?: number
}

export default function DeleteModal({
                                               hide,
                                               setHide,
                                               request,
                                               redirect,
                                               errorMessage,
                                               children,
                                               idToDelete = 0,
                                               successMessage,
                                               onDelete = () => {}}
                                               : DetailsDeleteModalProps){
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(request, {
        method: "DELETE"
    });
    const navigate = useNavigate();

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const motivo = formData.get("motivo") as string;

        const RequestData = {
            idToDelete: idToDelete,
            motivo: motivo
        } as DeleteRequestData;

        execute(RequestData);
    }

    const handleDelete = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                onDelete();
                if (redirect){
                    navigate(redirect);
                }
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: successMessage,
            errorMessage: errorMessage
        }
    )

    return (
        <ModalContainer hide={hide} setHide={setHide}>
            <form className={'confirmDelete'} onSubmit={handleDelete} ref={formRef}>
                <div className="confirmDeleteHeader">
                    <P bold={true}
                       uppercase={true}
                       variant='xlarge'>
                        {children}
                    </P>
                    <div className='closeButton'>
                        <CloseButton
                            variant='medium'
                            onClick={close}
                        />
                    </div>
                </div>

                <div className='confirmDeleteBody'>
                    <TextArea label='Confirmar motivo da exclusao' name='motivo' required={true} value=''/>
                </div>

                <div className='buttons'>
                    <ActionButton variant="cancel" size='large' onClick={close}>
                        {isLoading ? <Loading/> : "Cancelar"}
                    </ActionButton>
                    <ActionButton variant="delete" size='large' type={"submit"}>
                        {isLoading ? <Loading/> : "EXCLUIR"}
                    </ActionButton>
                </div>
            </form>
        </ModalContainer>
    );
}
