import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import React from "react";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import useView from "../../../../../../hooks/useView.ts";
import FormModal from "../../../../../../components/modals/FormModal";
import Input from "../../../../../../components/form/input/Input";
import {UnidadeResponseData} from "../../tables/UnidadeTable";

interface UnidadeEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data: UnidadeResponseData | undefined
}

interface UnidadeEditRequestData extends Record<string | symbol, unknown>{
    id: number,
    nome: string,
    sigla: string
}

export default function UnidadeEditModal({hide, setHide, data}: UnidadeEditModalProps) {
    const { refreshView } = useView();
    const unidadeEditEndpoint = useEndpoint().unidade(data?.unidadeId).editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(unidadeEditEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const nome = formData.get("nome") as string;
        const sigla = formData.get("sigla") as string;

        const RequestData = {
            id: data?.unidadeId,
            nome: nome,
            sigla: sigla
        } as UnidadeEditRequestData;

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
            successMessage: "Unidade editada com sucesso.",
            errorMessage: "Erro ao editar essa unidade."
        });

    return (
        <FormModal
            title={"Editar Unidade"}
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
            <Input type={"text"}
                   label={"Sigla"}
                   name={"sigla"}
                   value={data?.sigla || ""}
                   required={true}
                   disabled={isLoading}
            />
        </FormModal>
    );
}
