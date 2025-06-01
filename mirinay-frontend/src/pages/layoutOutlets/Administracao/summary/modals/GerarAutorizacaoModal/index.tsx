import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {useRef} from "react";
import FormModal from "../../../../../../components/modals/FormModal";
import Input from "../../../../../../components/form/input/Input";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";

import AutorizacaoGerarRequestData from "../../../../../../models/administracao/AutorizacaoGerarRequestData.ts";


interface AutorizacaoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    acoesIds: number[],
}

export default function GerarAutorizacaoModal({hide, setHide, acoesIds}: AutorizacaoDetailsEditModalProps) {
    const endpoint = useEndpoint().administacao().POST().gerar;
    const { refreshView } = useView();
    const formRef = useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(endpoint, {
        method: "POST"
    });


    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {

        const RequestData = {
            nome: formData.get("nome"),
            descricao: formData.get("descricao"),
            acoes: acoesIds,

        } as AutorizacaoGerarRequestData;

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
            successMessage: "Autorização gerada com sucesso.",
            errorMessage: "Erro ao gerar Autorização."
        });

    return (
        <FormModal
            title={"Gerar Autorização"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Gerar autorização"}
        >

            <div
                style={{
                    display: "flex",
                    gap: "10px"
                }}
            >

                <Input
                    type={'text'}
                    label={"Nome:"}
                    name={"nome"}
                    required={true}
                    disabled={isLoading}
                />
            </div>
            <div
                style={{
                    display: "flex",
                    gap: "10px"
                }}
            >

                <Input
                    type={'text'}
                    label={"Descrição:"}
                    name={"descricao"}
                    required={true}
                    disabled={isLoading}
                />
            </div>

        </FormModal>
    );
}
