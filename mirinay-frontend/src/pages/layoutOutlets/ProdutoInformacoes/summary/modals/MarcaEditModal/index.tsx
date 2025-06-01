import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import React from "react";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import useView from "../../../../../../hooks/useView.ts";
import FormModal from "../../../../../../components/modals/FormModal";
import Input from "../../../../../../components/form/input/Input";
import {MarcaResponseData} from "../../tables/MarcaTable";

interface MarcaEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data: MarcaResponseData | undefined
}

interface MarcaEditRequestData extends Record<string | symbol, unknown>{
    id: number,
    nome: string
}

export default function MarcaEditModal({hide, setHide, data}: MarcaEditModalProps) {
    const { refreshView } = useView();
    const marcaEditEndpoint = useEndpoint().marca(data?.id).editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(marcaEditEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const nome = formData.get("nome") as string;

        const RequestData = {
            id: data?.id,
            nome: nome
        } as MarcaEditRequestData;

        execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Marca editada com sucesso.",
            errorMessage: "Erro ao editar a marca."
        });

    return (
        <FormModal
            title={"Editar Marca"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input type={"text"}
                   label={"Nome"}
                   name={"nome"}
                   value={data?.nome || ""}
                   required={true}
                   disabled={isLoading}
            />

        </FormModal>
    );
}
