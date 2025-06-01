import {TableContainer} from "../../../../../../../components/table/TableContainer";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../hooks/useTableContent.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../../components/modals/DeleteModal";
import FornecedorCNPJDetailsRow from "../../../../components/rows/FornecedorCNPJDetailsRow";
import FornecedorCNPJDetailsHeader from "../../../../components/headers/FornecedorCNPJDetailsHeader";
import FornecedorCNPJDetailsEditModal from "../../modals/FornecedorCNPJDetailsEditModal";
import FornecedorCNPJResponseData from "../../../../../../../models/fornecedor/response/FornecedorCNPJResponseData.ts";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function FornecedorCNPJDetailsTable() {
    const id = useParams().fornecedorId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView } = useView();
    const [ auxId, setAuxId ] = useState<number | undefined>(undefined);
    const endpoint = `${useEndpoint().fornecedor().informacoes(id).cnpjs}`;
    const deleteEndpoint = useEndpoint().fornecedorCNPJ().operacoes(auxId).deletar;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<FornecedorCNPJResponseData>(endpoint);
    const [ selected, setSelected ] = useState<FornecedorCNPJResponseData>();
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);
    const [ hideEditModal, setHideEditModal ] = useState(true);
    const [ formattedData, setFormattedData ] = useState<FornecedorCNPJResponseData[]>([]);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    useEffect(() => {
        if (data) {
            const toFormat: FornecedorCNPJResponseData[] = data as FornecedorCNPJResponseData[];

            const popped = toFormat.filter((item) => item.tipo == 'MATRIZ');
            const filtered = toFormat.filter((item) => item.tipo != 'MATRIZ');
            setFormattedData(popped.concat(filtered));
        }
    }, [data]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data?: FornecedorCNPJResponseData) {

        switch (action){
            case "edit":
                setSelected(data);
                setHideEditModal(false);
                break;
            case "delete":
                setAuxId(data?.id);
                setHideDeleteModal(false);
                break;
        }
    }, [setAuxId, setSelected, setHideDeleteModal, setHideEditModal]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: FornecedorCNPJResponseData, index: number) => {
        return (
            <FornecedorCNPJDetailsRow
                stripped={index % 2 == 1}
                data={dados}
                deleteFunction={() => handleClick("delete", dados)}
                editFunction={() => handleClick("edit", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<FornecedorCNPJResponseData>({
        isLoading,
        error,
        isError,
        data: formattedData as FornecedorCNPJResponseData[],
        errorMessage: "Erro ao carregar CNPJs",
        contentFunction: contentFunction,
        beforeContent: () => <FornecedorCNPJDetailsHeader />
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={deleteEndpoint}
                errorMessage={"Erro ao deletar o CNPJ."}
                successMessage={"CNPJ deletado com sucesso!"}
                onDelete={
                    () => {
                        refreshDetails();
                        refreshView();
                    }
                }
            >
                Tem certeza que deseja deletar o fornecedor {selected?.nome ? selected?.nome : selected?.cnpj}?
            </DeleteModal>

            <FornecedorCNPJDetailsEditModal
                hide={hideEditModal}
                setHide={setHideEditModal}
                data={selected}
            />

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
