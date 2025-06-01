import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { useRef, useState} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import ClonagemResponseData from "../../../../../../models/clonagem/response/ClonagemResponseData.ts";
import InserirCadastrarTrader from "../../../components/InserirCadastrarTrader";
import ClonagemProdutoRequestData from "../../../../../../models/clonagem/request/ClonagemProdutoRequestData.ts";
import ClonagemFornecedorRequestData from "../../../../../../models/clonagem/request/ClonagemFornecedorRequestData.ts";
import ClonagemRequestData from "../../../../../../models/clonagem/request/ClonagemRequestData.ts";

type ClonagemSubmitFormProps = {
    clonagem?: ClonagemResponseData;
};

/**
 * Formulário de submissão de clonagem ou inserção de produto/fornecedor em uma clonagem
 * @constructor
 */
export default function ClonagemSubmitForm({ clonagem }: ClonagemSubmitFormProps){
    const { isSubmitContainerVisible, refreshView } = useView();
    const [ endpoint, setEndpoint ] = useState("");
    const [ successMessage, setSuccessMessage ] = useState<string>("");
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);
    const [ similares, setSimilares ] = useState<number[]>([]);

    const updateEndpoint = (endpoint: string) => {
        return setEndpoint(endpoint);
    }

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const submitType = formData.get("submitType") as string;

        if (submitType === "inserir"){
            const insertType = formData.get("insertType") as string;
            const clonagemId = formData.get("clonagem") as unknown as number;

            if (insertType === "produto"){
                setErrorMessage("Erro ao inserir similares na clonagem.");
                setSuccessMessage("Similares inseridos com sucesso.");

                const requestData = {
                    clonagemId: clonagemId,
                    similares: similares
                } as ClonagemProdutoRequestData;

                updateEndpoint(useEndpoint().clonagem().item().cadastrar().produto)

                execute(requestData);
            }
            else if (insertType === "fornecedor"){
                setErrorMessage("Erro ao inserir novo fornecedor na clonagem.");
                setSuccessMessage("Fornecedor inserido com sucesso.");

                const fornecedorId = formData.get("fornecedor") as unknown as number;

                const requestData = {
                    clonagemId: clonagemId,
                    fornecedorId: fornecedorId
                } as ClonagemFornecedorRequestData;

                updateEndpoint(useEndpoint().clonagem().item().cadastrar().fornecedor);

                execute(requestData);
            }
        }
        else if (submitType === "cadastrar"){
            setErrorMessage("Erro ao cadastrar nova clonagem.");
            setSuccessMessage("Clonagem cadastrada com sucesso.");

            const nomeClonagem = formData.get("nomeClonagem") as string;

            const requestData = {
                nome: nomeClonagem
            } as ClonagemRequestData;

            updateEndpoint(useEndpoint().clonagem().cadastrar().clonagem);

            execute(requestData);
        }
    }

    const handleSubmit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: successMessage,
            errorMessage: errorMessage
        });

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <InserirCadastrarTrader clonagem={clonagem} setSimilares={setSimilares}/>
        </SubmitContainer>
    );
}
