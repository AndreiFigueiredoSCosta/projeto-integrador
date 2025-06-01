import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {useRef} from "react";
import FormModal from "../../../../../../components/modals/FormModal";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";

import AutorizacaoGerarRequestData from "../../../../../../models/administracao/AutorizacaoGerarRequestData.ts";
import ListaAcaoAutorizacaoResponseData
    from "../../../../../../models/administracao/ListaAcaoAutorizacaoResponseData.ts";


interface AutorizacaoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    acoesIds: number[],
    setAcoesSelecionadas: React.Dispatch<React.SetStateAction<ListaAcaoAutorizacaoResponseData[]>>;

}

export default function DeletarAutorizacaoModal({hide, setHide, acoesIds, setAcoesSelecionadas}: AutorizacaoDetailsEditModalProps) {
    const endpoint = useEndpoint().administacao().DELETE().deletar;
    const { refreshView } = useView();
    const formRef = useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(endpoint, {
        method: "DELETE"
    });


    // Faz uma requisição de delete ao backend
    const formHandler = () => {

        const RequestData = {
            acoes: acoesIds,

        } as AutorizacaoGerarRequestData;

        execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setAcoesSelecionadas([]); // ✅ Agora essa função existe e está definida corretamente
                setHide(true);
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Deletado com sucesso.",
            errorMessage: "Erro ao gerar Autorização."
        });

    return (
        <FormModal
            title={"Deletar Autorização"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Deletar autorização"}
            children={true}/>


    );
}
