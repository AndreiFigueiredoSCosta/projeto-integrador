import useView from "../../../../../../../hooks/useView.ts";
import {SubmitContainer} from "../../../../../../../components/misc/SubmitContainer";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import { useRef } from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import SubgrupoRequestData from "../../../../../../../models/grupo/request/SubgrupoRequestData.ts";
import Input from "../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../components/form/textarea/Textarea";
import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";

/**
 * Formulário de subgrupo
 * @constructor
 */
export default function SubgrupoSubmitForm() {
    const {isSubmitContainerVisible, refreshView } = useView();
    const { refreshDetails } = useDetails();
    const grupoId = useParams().grupoId as unknown as number;
    const subgrupoEndpoint = useEndpoint().subgrupo().operacoes().cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const {isLoading, isError, error, execute, isSuccess} = useMutate(subgrupoEndpoint);

    // Form submit handling
    const formHandler =
        (formData: FormData) => {
            const name = formData.get("nome") as string;
            const description = formData.get("descricao") as string;

            // Cria o objeto de dados da requisição
            const RequestData = {
                nome: name,
                descricao: description,
                grupoId: grupoId
            } as SubgrupoRequestData;

            // Executa a requisição
            execute(RequestData);
    }

    const handleSubmit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                refreshDetails();
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Subgrupo cadastrado com sucesso.",
            errorMessage: "Erro ao cadastrar subgrupo."
        });


    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         size={"small"}
                         isLoading={isLoading}
                         formRef={formRef}
                         onSubmit={handleSubmit}
                         btnText={"inserir"}
        >
            <Input
                type={"text"}
                label={"Nome do Subgrupo"}
                name={"nome"}
                required={true}
            />
            <TextArea
                label={"Descrição"}
                name={"descricao"}
                required={false}
            />
        </SubmitContainer>
    );
}
