import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import React from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import FormModal from "../../../../../../../components/modals/FormModal";
import Input from "../../../../../../../components/form/input/Input";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import FornecedorRequestData from "../../../../../../../models/fornecedor/request/FornecedorRequestData.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function FornecedorDetailsEditModal({hide, setHide}: GrupoDetailsEditModalProps) {
    const id = useParams().fornecedorId as unknown as number;
    const { data, refreshDetails } = useDetails();
    const dataMapped = data as FornecedorRequestData;
    const editEndpoint = useEndpoint().fornecedor().operacoes(id).editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(editEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const nome = formData.get("nome") as string;

        const RequestData = {
            id: id,
            nome: nome
        } as FornecedorRequestData;

        execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                refreshDetails();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Fornecedor editado com sucesso.",
            errorMessage: "Erro ao editar o fornecedor."
        });

    return (
        <FormModal
            title={"Editar Fornecedor"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input
                label={"Nome do fornecedor"}
                type={'text'}
                name={'nome'}
                required={true}
                minLength={3}
                maxLength={255}
                value={dataMapped?.nome || ""}
                disabled={isLoading}
            />
        </FormModal>
    );
}
