import useDetails from "../../../../../../../hooks/useDetails.ts";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import React, {useEffect} from "react";
import {useMutate} from "../../../../../../../hooks/useMutate.ts";
import FormModal from "../../../../../../../components/modals/FormModal";
import Input from "../../../../../../../components/form/input/Input";
import {TextArea} from "../../../../../../../components/form/textarea/Textarea";
import useFormHandler from "../../../../../../../hooks/useFormHandler.ts";
import SimilarResponseData from "../../../../../../../models/produto/response/SimilarResponseData.ts";
import useView from "../../../../../../../hooks/useView.ts";
import SimilarEditRequestData from "../../../../../../../models/produto/request/SimilarEditRequestData.ts";
import RequestSelect from "../../../../../../../components/form/select/RequestSelect";
import {SelectOption} from "../../../../../../../types/SelectOption.ts";

interface GrupoDetailsEditModalProps {
    hide: boolean,
    setHide: (value: (((prevState: boolean) => boolean) | boolean)) => void,
    data?: SimilarResponseData
}

export default function ProdutoSimilarDetailsEditModal({hide, setHide, data}: GrupoDetailsEditModalProps) {
    // const produtoId = useParams().produtoId as unknown as number;
    const similarId = data?.idSimilar || 0;
    const { refreshDetails } = useDetails();
    const { refreshView } = useView();
    const [ marcaOption, setMarcaOption ] = React.useState<SelectOption | undefined>();
    const similarEditEndpoint = useEndpoint().similar().operacoes(0, similarId).editar;
    const formRef = React.useRef<HTMLFormElement>(null);
    const { execute, isSuccess, isError, error, isLoading } = useMutate(similarEditEndpoint, {
        method: "PUT"
    });

    // Faz uma requisição de delete ao backend
    const formHandler = (formData: FormData) => {
        const referencia = formData.get("referencia") as string;
        const marca = formData.get("marca") as unknown as number;
        const observacao = formData.get("observacao") as string;

        const RequestData = {
            referencia: referencia,
            idMarca: marca,
            observacao: observacao
        } as SimilarEditRequestData;

        execute(RequestData);
    }

    const handleEdit = useFormHandler(
        {
            formRef,
            isSuccess,
            onSuccess: () => {
                setHide(true);
                refreshDetails();
                refreshView();
            },
            isError,
            error,
            formHandler: formHandler,
            successMessage: "Similar editado com sucesso.",
            errorMessage: "Erro ao editar o item."
        });

    useEffect(() => {
        setMarcaOption({
            value: data?.marcaId || 0,
            label: data?.marca || ""
        })
    }, [data, setMarcaOption]);

    return (
        <FormModal
            title={"Editar Similar"}
            setHide={setHide}
            hide={hide}
            onSubmit={handleEdit}
            formRef={formRef}
            isLoading={isLoading}
            btnText={"Editar"}
        >
            <Input type={"text"}
                   label={"Referência"}
                   name={"referencia"}
                   value={data?.codigoReferencia || ""}
                   required={true}
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
                selected={marcaOption}
            />
            <TextArea label={"Observação"}
                      name={"observacao"}
                      value={data?.observacao || ""}
                      required={false}
                      disabled={isLoading}
            />
        </FormModal>
    );
}
