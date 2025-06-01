import useEndpoint from "../../../../../../../../hooks/useEndpoint.ts";
import useView from "../../../../../../../../hooks/useView.ts";
import {useParams} from "react-router-dom";
import {useMutate} from "../../../../../../../../hooks/useMutate.ts";
import {useCallback, useRef, useState} from "react";
import FormModal from "../../../../../../../../components/modals/FormModal/index.tsx";
import useFormHandler from "../../../../../../../../hooks/useFormHandler.ts";
import CotacaoProdutoSimilarTrader from "../../../../../components/misc/CotacaoProdutoSimilarTrader";
import CotacaoRevisaoProdutoResponseData
    from "../../../../../../../../models/cotacao/revisao/response/CotacaoRevisaoProdutoResponseData.ts";
import CotacaoRevisaoProdutoRequestData
    from "../../../../../../../../models/cotacao/revisao/request/CotacaoRevisaoProdutoRequestData.ts";
import CotacaoRevisaoSimilarRequestData
    from "../../../../../../../../models/cotacao/revisao/request/CotacaoRevisaoSimilarRequestData.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data?: CotacaoRevisaoProdutoResponseData
}

export default function CotacaoRevisaoProdutoSubmitModal({hide, setHide, data}: GrupoDetailsEditModalProps) {
    const id = useParams().requisicaoId as unknown as number;
    const { refreshView } = useView();
    const [ endpoint, setEndpoint ] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(endpoint);

    const updateEndpoint = useCallback(function updateEndpoint(endpoint: string){
        return setEndpoint(endpoint);
    }, [setEndpoint]);


    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const submitType = formData.get("submitType") as string;

        if (submitType === "produto") {
            const name = formData.get("nome") as string;
            const description = formData.get("descricao") as string;
            const subgrupo = formData.get("subgrupo") as unknown as number;
            const unidade = formData.get("unidade") as unknown as number;
            const observacao = formData.get("observacao") as string;
            const marca = formData.get("marca") as unknown as number;

            const RequestData = {
                nomeProduto: name,
                descricao: description,
                subgrupoId: subgrupo,
                unidadeId: unidade,
                observacao: observacao,
                itemId: data?.itemId,
                referencia: data?.referencia,
                marcaId: marca
            } as CotacaoRevisaoProdutoRequestData;

            updateEndpoint(useEndpoint().cotacao().POST().revisao(id).item().cadastrarProduto);

            execute(RequestData);
        }
        else if (submitType === "similar") {
            const observacao = formData.get("observacao") as string;
            const marca = formData.get("marca") as unknown as number;
            const produto = formData.get("produto") as unknown as number;

            const RequestData = {
                itemId: data?.itemId,
                referencia: data?.referencia,
                observacao: observacao,
                produtoId: produto,
                marcaId: marca
            } as CotacaoRevisaoSimilarRequestData;

            updateEndpoint(useEndpoint().cotacao().POST().revisao(id).item().cadastrarSimilar);

            execute(RequestData);
        }
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
            successMessage: "Cadastro efetuado com sucesso.",
            errorMessage: "Erro ao cadastrar!"
        });

    return (
        <FormModal
            title={`Cadastrar ${data?.referencia}`}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Cadastrar"}
        >
            <CotacaoProdutoSimilarTrader />
        </FormModal>
    )
        ;
}
