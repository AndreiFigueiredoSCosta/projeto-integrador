import React, {FormEvent, ReactNode} from "react";
import {ModalContainer} from "../components/ModalContainer";
import {Bar} from "../../table/components/Bar";
import {P} from "../../text/P";
import {ActionButton} from "../../buttons/action/ActionButton";

import "./style.css";
import {CloseButton} from "../../buttons/misc/CloseButton";
import RequiredWarning from "../../misc/RequiredWarning";

interface ModalContentProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    title: string,
    children: ReactNode,
    btnText?: string,
    onSubmit: (e: FormEvent) => void,
    formRef: React.RefObject<HTMLFormElement>,
    isLoading?: boolean,
    isSubmitDisabled?: boolean
}

export default function FormModal({
                                  hide,
                                  setHide,
                                  btnText = "Cadastrar",
                                  onSubmit,
                                  formRef,
                                  children,
                                  title,
                                  isLoading = false,
                                  isSubmitDisabled = false
                              }: ModalContentProps) {
    return (
        <ModalContainer hide={hide} setHide={setHide}>
            <div className={"modal"}>
                <Bar size={"large"} variant={"upper"}>
                    <div className={"modal-header"}>
                        <P variant={"xxlarge"} bold={true} uppercase={true} color={"black"} align={"middle"}
                           justify={"center"}>{title}</P>
                        <CloseButton variant={"large"} onClick={() => setHide((prevstate) => !prevstate)}/>
                    </div>
                </Bar>
                    {
                        children &&
                        <form className={"modal-form"} ref={formRef} onSubmit={onSubmit}>

                                <div>
                                    <RequiredWarning/>
                                    <div className={"modal-content"}>
                                        {children}
                                    </div>
                                </div>
                            <ActionButton hasLoading={isLoading} variant={"submit"} size={"small"} type={"submit"} disabled={isLoading || isSubmitDisabled}>
                                {btnText}
                            </ActionButton>
                        </form>
                    }
                <Bar size={"small"} variant={"lower"}/>
            </div>
        </ModalContainer>
    );
}
