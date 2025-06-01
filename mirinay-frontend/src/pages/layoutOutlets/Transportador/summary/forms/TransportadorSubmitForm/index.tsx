import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {useCallback, useRef, useState} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import useView from "../../../../../../hooks/useView.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";
import TransportadorFilialTrader from "../../../components/TransportadorFilialTrader/index.tsx";
import TransportadorResponseData from "../../../../../../models/transportador/response/TransportadorResponseData.ts";
import TransportadorRequestData from "../../../../../../models/transportador/request/TransportadorRequestData.ts";
import TransportadorCnpjRequestData
    from "../../../../../../models/transportador/request/TransportadorCnpjRequestData.ts";
import MatrizFilialEnum from "../../../../../../enums/MatrizFilialEnum.ts";

type ProdutoSimilarSubmitFormProps = {
    transportador?: TransportadorResponseData;
};

/**
 * Formulário de submissão de grupo/subgrupo
 * @param visible - Se o formulário está visível
 * @constructor
 */
export default function TransportadorSubmitForm ({ transportador }: ProdutoSimilarSubmitFormProps){
    const viewContext = useView();
    const transportadorEndpoint = useEndpoint().transportador().operacoes().cadastrar;
    const [ endpoint, setEndpoint ] = useState(transportadorEndpoint);
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    const updateEndpoint = useCallback(function updateEndpoint(endpoint: string){
        return setEndpoint(endpoint);
    }, [setEndpoint]);

    const updateEndpointAux = useCallback(function updateProduto(id: number){
        updateEndpoint(useEndpoint().transportadorCnpj().operacoes(id).cadastrar);
    }, []);

    // Form submit handling
    const formHandler = (formData: FormData) => {
        const submitType = formData.get("submitType") as string;

        if (submitType === "transportador") {
            const nome = formData.get("nome") as string;

            const RequestData = {
                nome: nome
            } as TransportadorRequestData;

            updateEndpoint(transportadorEndpoint);

            execute(RequestData);
        }
        else if (submitType === "cnpj") {
            const transportador = formData.get("transportador") as unknown as number;
            const apelido = formData.get("apelido") as string;
            const email = formData.get("email") as string;
            const celular = formData.get("celular") as string;
            const telefone = formData.get("telefone") as string;
            const matrizSwitch = formData.get("matriz") as string;
            const cnpj = formData.get("cnpj") as string;

            const tipo = matrizSwitch === "on"? MatrizFilialEnum.MATRIZ : MatrizFilialEnum.FILIAL;

            const RequestData = {
                nome: apelido,
                email: email,
                telefone: telefone,
                celular: celular,
                cnpj: cnpj,
                tipo: tipo
            } as TransportadorCnpjRequestData;

            updateEndpointAux(transportador);

            // console.log(RequestData);

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
        successMessage: "Transportador cadastrado com sucesso.",
        errorMessage: "Erro ao cadastrar transportador."
    })

    return (
        <SubmitContainer hide={!viewContext.isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <TransportadorFilialTrader transportador={transportador} />
        </SubmitContainer>
    );
}
