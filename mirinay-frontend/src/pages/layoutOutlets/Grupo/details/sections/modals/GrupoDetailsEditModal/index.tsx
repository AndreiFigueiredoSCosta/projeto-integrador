import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import React from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import GrupoEditRequestData from "../../../../../../../models/grupo/request/GrupoEditRequestData.ts";
import FormModal from "../../../../../../../components/modals/FormModal";
import GrupoResponseData from "../../../../../../../models/grupo/response/GrupoResponseData.ts";
import Input from "../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../components/form/textarea/Textarea";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function GrupoDetailsEditModal({hide, setHide}: GrupoDetailsEditModalProps) {
    const grupoId = useParams().grupoId as unknown as number;
    const { data, refreshDetails } = useDetails();
    const dataMapped = data as GrupoResponseData;
    const grupoEditEndpoint = useEndpoint().grupo().operacoes().editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(grupoEditEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const RequestData = {
            descricao: formData.get("descricao") as string,
            nome: formData.get("nome") as string,
            grupoId: grupoId
        } as GrupoEditRequestData;

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
            successMessage: "Grupo editado com sucesso.",
            errorMessage: "Erro ao editar o grupo."
        });

    return (
        <FormModal
            title={"Editar Grupo"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input type={"text"}
                   label={"Nome do Grupo"}
                   name={"nome"}
                   value={dataMapped?.nome || ""}
                   required={true}
                   disabled={isLoading}
            />
            <TextArea label={"Descrição do Grupo"}
                      name={"descricao"}
                      value={dataMapped?.descricao || ""}
                      required={false}
                      disabled={isLoading}
            />
        </FormModal>
    );
}
