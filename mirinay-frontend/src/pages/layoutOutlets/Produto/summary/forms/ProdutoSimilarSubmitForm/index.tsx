import ProdutoResponseData from "../../../../../../models/produto/response/ProdutoResponseData.ts";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useCallback, useRef, useState} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import NovoSimilarTrader from "../../../components/NovoSimilarTrader/index.tsx";
import useView from "../../../../../../hooks/useView.ts";
import SimilarRequestData from "../../../../../../models/produto/request/SimilarRequestData.ts";
import ProdutoRequestData from "../../../../../../models/produto/request/ProdutoRequestData.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";

type ProdutoSimilarSubmitFormProps = {
    produto?: ProdutoResponseData;
};

/**
 * Formulário de submissão de grupo/subgrupo
 * @param visible - Se o formulário está visível
 * @constructor
 */
export default function ProdutoSimilarSubmitForm({ produto }: ProdutoSimilarSubmitFormProps){
    const viewContext = useView();
    const produtoEndpoint = useEndpoint().produto().operacoes().cadastrar;
    const [ endpoint, setEndpoint ] = useState(produtoEndpoint);
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    const updateEndpoint = useCallback(function updateEndpoint(endpoint: string){
        return setEndpoint(endpoint);
    }, [setEndpoint]);

    const updateProduto = useCallback(function updateProduto(id: number){
        return updateEndpoint(useEndpoint().similar().operacoes(id).cadastrar);
    }, []);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const submitType = formData.get("submitType") as string;

        if (submitType === "produto") {
            const name = formData.get("nome") as string;
            const description = formData.get("descricao") as string;
            const subgrupo = formData.get("subgrupo") as unknown as number;
            const unidade = formData.get("unidade") as unknown as number;

            const RequestData = {
                nome: name,
                descricao: description,
                subgrupoId: subgrupo,
                unidadeId: unidade
            } as ProdutoRequestData;

            updateEndpoint(produtoEndpoint);

            execute(RequestData);
        }
        else if (submitType === "similar") {
            const observacao = formData.get("observacao") as string;
            const marca = formData.get("marca") as unknown as number;
            const referencia = formData.get("referencia") as string;
            const produto = formData.get("produto") as unknown as number;

            const RequestData = {
                observacao: observacao,
                idMarca: marca,
                referencia: referencia
            } as SimilarRequestData;

            updateProduto(produto);

            execute(RequestData);
        }
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
        successMessage: "Produto cadastrado com sucesso.",
        errorMessage: "Erro ao cadastrar produto.",

    })

    return (
        <SubmitContainer hide={!viewContext.isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <NovoSimilarTrader produto={produto} />
        </SubmitContainer>
    );
}
