import {ReactNode} from "react";
import {ModalContainer} from "../components/ModalContainer";
import {P} from "../../text/P";
import {ActionButton} from "../../buttons/action/ActionButton";

import "./style.css";
import {CloseButton} from "../../buttons/misc/CloseButton";

interface ModalContentProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    title: string,
    children: ReactNode,
    confirmBtnText?: string,
    cancelBtnText?: string,
    onConfirm: () => void,
    onCancel?: () => void,
    isLoading?: boolean
}

export default function ConfirmModal({
                                  hide,
                                  setHide,
                                  confirmBtnText = "Confirmar",
                                  children,
                                  title,
                                  cancelBtnText = "Cancelar",
                                  isLoading = false,
                                  onConfirm,
                                  onCancel,
                              }: ModalContentProps) {
    return (
        <ModalContainer hide={hide} setHide={setHide}>
            <div className={"confirm-modal"}>
                <div className={"confirm-modal-header"}>
                    <P variant={"xxlarge"} bold={true} uppercase={true} color={"black"} align={"middle"}
                       justify={"center"}>{title}</P>
                    <CloseButton variant={"large"} onClick={() => setHide((prevstate) => !prevstate)}/>
                </div>
                {
                    children &&
                    <form className={"confirm-modal-content"} onSubmit={(e) => e.preventDefault()}>
                        <P
                            variant={"xlarge"}
                            color={"black"}
                            align={"middle"}
                            justify={"left"}
                            uppercase={false}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                            >
                                {children}
                            </P>
                            <div className={`confirm-modal-btn-group`}>
                                <ActionButton
                                    variant={"cancel"}
                                    size={"small"}
                                    disabled={isLoading}
                                    hasLoading={isLoading}
                                    onClick={() => {
                                        if (onCancel) {
                                            onCancel();
                                        }
                                        else {
                                            setHide((prevstate) => !prevstate)
                                        }
                                    }}
                                >
                                    {cancelBtnText}
                                </ActionButton>

                                <ActionButton
                                    variant={"submit"}
                                    size={"small"}
                                    disabled={isLoading}
                                    hasLoading={isLoading}
                                    onClick={() => {
                                        onConfirm();
                                    }}
                                >
                                    {confirmBtnText}
                                </ActionButton>
                            </div>
                        </form>
                    }
            </div>
        </ModalContainer>
    );
}
