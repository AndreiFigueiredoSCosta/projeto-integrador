import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useRef} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import MargemDTO from "../../../../../../models/margem/MargemDTO.ts";
import Input from "../../../../../../components/form/input/Input";
import FormModal from "../../../../../../components/modals/FormModal";

type MargemEditModalProps = {
    margem: MargemDTO | null,
    hide: boolean,
    setHide: (value: boolean | ((prevState: boolean) => boolean)) => void
}

export default function MargemEditModal({margem, setHide, hide} : MargemEditModalProps){
    const {refreshView } = useView();
    const endpoint = useEndpoint().margem().PUT().editar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const nome = formData.get("nome") as string;
        const porcentagem = formData.get("porcentagem") as unknown as number;

        const RequestData = {
            margemId: margem?.margemId,
            nome: nome,
            valor: porcentagem,
        } as MargemDTO;

        execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Margem editada com sucesso.",
            errorMessage: "Erro ao editar margem."
        });

    return (
        <FormModal
            hide={hide}
            setHide={setHide}
            title={"Editar Margem"}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
            >
            <Input type={"text"} label={"Nome"} name={"nome"} required={true} minLength={3} maxLength={255} value={margem?.nome}/>
            <Input type={"number"} label={"Porcentagem"} name={"porcentagem"} required={true} min={0} max={100} step={0.01} value={margem?.valor as unknown as string}/>

        </FormModal>
    );
}
