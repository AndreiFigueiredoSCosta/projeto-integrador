import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import { useCallback, useRef, useState} from "react";
import {useMutate} from "../../../../../../hooks/useMutate.ts";
import {SubmitContainer} from "../../../../../../components/misc/SubmitContainer";
import GrupoSubgrupoTrader from "../../../components/GrupoSubgrupoTrader";
import {TextArea} from "../../../../../../components/form/textarea/Textarea";
import useView from "../../../../../../hooks/useView.ts";
import SubgrupoRequestData from "../../../../../../models/grupo/request/SubgrupoRequestData.ts";
import GrupoResponseData from "../../../../../../models/grupo/response/GrupoResponseData.ts";
import GrupoRequestData from "../../../../../../models/grupo/request/GrupoRequestData.ts";
import useFormHandler from "../../../../../../hooks/useFormHandler.ts";

type GrupoSubgrupoSubmitFormProps = {
    grupo?: GrupoResponseData;
};

/**
 * Formulário de submissão de grupo/subgrupo
 * @param visible - Se o formulário está visível
 * @param grupo - Dados do grupo que será inserido no select
 * @constructor
 */
export default function GrupoSubgroupSubmitForm({ grupo }: GrupoSubgrupoSubmitFormProps){
    const { isSubmitContainerVisible, refreshView } = useView();
    const subgrupoEndpoint = useEndpoint().subgrupo().operacoes().cadastrar;
    const grupoEndpoint = useEndpoint().grupo().operacoes().cadastrar;
    const [ endpoint, setEndpoint ] = useState(grupoEndpoint);
    const formRef = useRef<HTMLFormElement>(null);
    const { isLoading, isError, error, execute, isSuccess } = useMutate(endpoint);

    const updateEndpoint = useCallback(function updateEndpoint(endpoint: string){
        return setEndpoint(endpoint);
    }, [setEndpoint]);

    // Form submit handling
    const formHandler = (formData: FormData)=> {
        const tipo = formData.get("submitType") as string;

        if (tipo === "grupo"){
            const name = formData.get("nome") as string;
            const description = formData.get("descricao") as string;
            const RequestData = {
                nome: name,
                descricao: description,
            } as GrupoRequestData;
            updateEndpoint(grupoEndpoint);
            execute(RequestData);
        }
        else if (tipo === "subgrupo"){
            const name = formData.get("nome") as string;
            const description = formData.get("descricao") as string;
            const grupo = formData.get("grupo") as unknown as number;
            const RequestData = {
                nome: name,
                descricao: description,
                grupoId: grupo
            } as SubgrupoRequestData;

            console.log(RequestData);

            updateEndpoint(subgrupoEndpoint);
            execute(RequestData);
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
            successMessage: "Grupo/Subgrupo cadastrado com sucesso.",
            errorMessage: "Erro ao cadastrar grupo/subgrupo."
        });

    return (
        <SubmitContainer hide={!isSubmitContainerVisible}
                         onSubmit={handleSubmit}
                         formRef={formRef}
                         isLoading={isLoading}
        >
            <GrupoSubgrupoTrader grupo={grupo}/>
            <TextArea label={"Descrição"} name={"descricao"} required={false} />
        </SubmitContainer>
    );
}
