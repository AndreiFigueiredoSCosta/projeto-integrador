import {useParams} from "react-router-dom";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import React from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import FormModal from "../../../../../../../components/modals/FormModal";
import Input from "../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../components/form/textarea/Textarea";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import ProdutoDetailsResponseData from "../../../../../../../models/produto/response/ProdutoDetailsResponseData.ts";
import ProdutoRequestData from "../../../../../../../models/produto/request/ProdutoRequestData.ts";
import RequestSelect from "../../../../../../../components/form/select/RequestSelect";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function ProdutoDetailsEditModal({hide, setHide}: GrupoDetailsEditModalProps) {
    const produtoId = useParams().produtoId as unknown as number;
    const { data, refreshDetails } = useDetails();
    const dataMapped = data as ProdutoDetailsResponseData;
    const produtoEditEndpoint = useEndpoint().produto().operacoes(produtoId).editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(produtoEditEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const nome = formData.get("nome") as string;
        const subgrupo = formData.get("subgrupo") as unknown as number;
        const descricao = formData.get("descricao") as string;
        const unidade = formData.get("unidade") as unknown as number;

        const RequestData = {
            nome: nome,
            subgrupoId: subgrupo,
            descricao: descricao,
            unidadeId: unidade
        } as ProdutoRequestData;

        execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                refreshDetails();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Produto editado com sucesso.",
            errorMessage: "Erro ao editar o produto."
        });

    return (
        <FormModal
            title={"Editar Produto"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input
                label={"Nome do produto"}
                type={'text'}
                name={'nome'}
                required={true}
                minLength={3}
                maxLength={255}
                value={dataMapped?.nomeProduto || ""}
                disabled={isLoading}
            />
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().subgrupo().buscas(inputValue).select
                }}
                name={"subgrupo"}
                label={"Subgrupo"}
                required={true}
                disabled={isLoading}
            />
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().unidade().select(inputValue);
                }}
                name={"unidade"}
                label={"Unidade"}
                required={true}
                disabled={isLoading}
            />
            <TextArea
                label={"Descrição"}
                name={"descricao"}
                required={false}
                minLength={3}
                maxLength={255}
                value={dataMapped?.descricao || ""}
                disabled={isLoading}
            />
        </FormModal>
    );
}
