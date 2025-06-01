import RequestSelect from "../../../../../../../components/form/select/RequestSelect";
import Input from "../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../components/form/textarea/Textarea";
import {useParams} from "react-router-dom";
import useView from "../../../../../../../hooks/useView.ts";
import {useRef} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import SimilarRequestData from "../../../../../../../models/produto/request/SimilarRequestData.ts";
import {SubmitContainer} from "../../../../../../../components/misc/SubmitContainer";

/**
 * Formulário de submissão de grupo/subgrupo
 * @constructor
 */
export default function ProdutoSimilarSubmitForm(){
    const viewContext = useView();
    const produtoId = useParams().produtoId as unknown as number;
    const similarEndpoint = useEndpoint().similar().operacoes(produtoId).cadastrar;
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(similarEndpoint);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const observacao = formData.get("observacao") as string;
        const marca = formData.get("marca") as unknown as number;
        const referencia = formData.get("referencia") as string;

        const RequestData = {
            observacao: observacao,
            idMarca: marca,
            referencia: referencia
        } as SimilarRequestData;

        execute(RequestData);
    }

    const handleSubmit = useFormHandler({
        formRef,
        isSuccess,
        onSuccess: () => {
            viewContext.refreshView();
        },
        isError,
        error,
        formHandler: formHandler,
        successMessage: "Similar cadastrado com sucesso.",
        errorMessage: "Erro ao cadastrar item."
    })

    return (
        <SubmitContainer hide={!viewContext.isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >

            <Input
                type={'text'}
                name={'referencia'}
                label={'Referência'}
                required={true}
                minLength={3}
                maxLength={255}
                disabled={isLoading}
            />
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().marca().select(inputValue);
                }}
                name={"marca"}
                label={"Marca"}
                disabled={isLoading}
                required={false}
            />
            <TextArea
                label={"Observação"}
                name={"observacao"}
                required={false}
                minLength={3}
                maxLength={255}
                disabled={isLoading}
            />
        </SubmitContainer>
    );
}
