import {useParams} from "react-router-dom";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import React from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import FormModal from "../../../../../../../components/modals/FormModal";
import Input from "../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../components/form/textarea/Textarea";
import SubgrupoResponseData from "../../../../../../../models/grupo/response/SubgrupoResponseData.ts";
import SubgrupoEditRequestData from "../../../../../../../models/grupo/request/SubgrupoEditRequestData.ts";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import useView from "../../../../../../../hooks/useView.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    subgrupo: SubgrupoResponseData | undefined
}

export default function SubgrupoDetailsEditModal({hide, setHide, subgrupo}: GrupoDetailsEditModalProps) {
    const grupoId = useParams().grupoId as unknown as number;
    const { refreshView } = useView();
    const subgrupoEditEndpoint = useEndpoint().subgrupo().operacoes(subgrupo?.subgrupoId).editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(subgrupoEditEndpoint, {
        method: "PUT"
    });

    // Função de edição do subgrupo
    const formHandler = (formData: FormData)=> {
        const RequestData = {
            descricao: formData.get("descricao") as string,
            nome: formData.get("nome") as string,
            subgrupoId: subgrupo?.subgrupoId,
            grupoId: grupoId
        } as SubgrupoEditRequestData;

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
            successMessage: "Subgrupo editado com sucesso.",
            errorMessage: "Erro ao editar o subgrupo."
        });

    return (
        <FormModal
            title={"Editar Subgrupo"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input type={"text"}
                   label={"Nome do Subgrupo"}
                   name={"nome"}
                   value={subgrupo?.nome || ""}
                   required={true}
                   disabled={isLoading}
            />
            <TextArea label={"Descrição do Subgrupo"}
                      name={"descricao"}
                      value={subgrupo?.descricao || ""}
                      required={false}
                      disabled={isLoading}
            />
        </FormModal>
    );
}
