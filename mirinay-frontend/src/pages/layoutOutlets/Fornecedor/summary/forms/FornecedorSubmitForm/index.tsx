import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useCallback, useRef, useState} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import MatrizFilialEnum from "../../../../../../enums/MatrizFilialEnum.ts";
import FornecedorCNPJTrader from "../../../components/FornecedorCNPJTrader/index.tsx";
import FornecedorResponseData from "../../../../../../models/fornecedor/response/FornecedorResponseData.ts";
import FornecedorRequestData from "../../../../../../models/fornecedor/request/FornecedorRequestData.ts";
import FornecedorCNPJRequestData from "../../../../../../models/fornecedor/request/FornecedorCNPJRequestData.ts";

type ProdutoSimilarSubmitFormProps = {
    fornecedor?: FornecedorResponseData;
};

/**
 * Formulário de submissão de grupo/subgrupo
 * @param visible - Se o formulário está visível
 * @constructor
 */
export default function FornecedorSubmitForm ({ fornecedor }: ProdutoSimilarSubmitFormProps){
    const viewContext = useView();
    const endpointPrincipal = useEndpoint().fornecedor().operacoes().cadastrar;
    const [ endpoint, setEndpoint ] = useState(endpointPrincipal);
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    const updateEndpoint = useCallback(function updateEndpoint(endpoint: string){
        return setEndpoint(endpoint);
    }, [setEndpoint]);

    const updateEndpointAux = useCallback(function updateProduto(id: number){
        updateEndpoint(useEndpoint().fornecedorCNPJ().operacoes(id).cadastrar);
    }, []);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const submitType = formData.get("submitType") as string;

        if (submitType === "fornecedor") {
            const nome = formData.get("nome") as string;

            const RequestData = {
                nome: nome
            } as FornecedorRequestData;

            updateEndpoint(endpointPrincipal);

            execute(RequestData);
        }
        else if (submitType === "cnpj") {
            const fornecedorSelect = formData.get("fornecedor") as unknown as number;
            const nome = formData.get("nome") as string;
            const email = formData.get("email") as string;
            const cidade = formData.get("cidade") as string;
            const estado = formData.get("estado") as string;
            const telefone = formData.get("telefone") as string;
            const matrizSwitch = formData.get("matriz") as string;
            const cnpj = formData.get("cnpj") as string;
            const pedidoMinimo = formData.get("pedidoMinimo") as unknown as number;

            const tipo = matrizSwitch === "on"? MatrizFilialEnum.MATRIZ : MatrizFilialEnum.FILIAL;

            const RequestData = {
                nome: nome,
                cnpj: cnpj,
                email: email,
                telefone: telefone,
                tipo: tipo,
                fornecedorId: fornecedorSelect,
                cidade: cidade,
                estado: estado,
                pedidoMinimo: pedidoMinimo
            } as FornecedorCNPJRequestData;

            updateEndpointAux(fornecedorSelect);

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
        successMessage: "Fornecedor cadastrado com sucesso.",
        errorMessage: "Erro ao cadastrar fornecedor."
    })

    return (
        <SubmitContainer hide={!viewContext.isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <FornecedorCNPJTrader fornecedor={fornecedor} />
        </SubmitContainer>
    );
}
