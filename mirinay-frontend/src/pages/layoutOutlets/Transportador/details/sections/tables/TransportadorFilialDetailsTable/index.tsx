import {TableContainer} from "../../../../../../../components/table/TableContainer";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import useTableContent from "../../../../../../../hooks/useTableContent.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../../components/modals/DeleteModal";
import TransportadorFilialDetailsRow from "../../../../components/rows/TransportadorFilialDetailsRow";
import TransportadorFilialDetailsHeader from "../../../../components/headers/TransportadorFilialDetailsHeader";
import TransportadorFilialDetailsEditModal from "../../modals/TransportadorFilialDetailsEditModal";
import TransportadorCnpjResponseData
    from "../../../../../../../models/transportador/response/TransportadorCnpjResponseData.ts";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function TransportadorFilialDetailsTable() {
    const id = useParams().transportadorId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView } = useView();
    const [ auxId, setAuxId ] = useState<number | undefined>(undefined);
    const endpoint = `${useEndpoint().transportador().informacoes(id).cnpjs}`;
    const deleteEndpoint = useEndpoint().transportadorCnpj().operacoes(0, auxId).deletar;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<TransportadorCnpjResponseData>(endpoint);
    const [ selectedSimilar, setSelectedSimilar ] = useState<TransportadorCnpjResponseData>();
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);
    const [ hideEditModal, setHideEditModal ] = useState(true);
    const [ formattedData, setFormattedData ] = useState<TransportadorCnpjResponseData[]>([]);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    useEffect(() => {
        if (data) {
            const toFormat: TransportadorCnpjResponseData[] = data as TransportadorCnpjResponseData[];

            const popped = toFormat.filter((item) => item.tipo == 'MATRIZ');
            const filtered = toFormat.filter((item) => item.tipo != 'MATRIZ');
            setFormattedData(popped.concat(filtered));
        }
    }, [data]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, data?: TransportadorCnpjResponseData) {

        switch (action){
            case "edit":
                setSelectedSimilar(data);
                setHideEditModal(false);
                break;
            case "delete":
                setAuxId(data?.transportadorCnpjId);
                setHideDeleteModal(false);
                break;
        }
    }, [setAuxId, setSelectedSimilar, setHideDeleteModal, setHideEditModal]);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: TransportadorCnpjResponseData, index: number) => {
        return (
            <TransportadorFilialDetailsRow
                stripped={index % 2 == 1}
                data={dados}
                deleteFunction={() => handleClick("delete", dados)}
                editFunction={() => handleClick("edit", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<TransportadorCnpjResponseData>({
        isLoading,
        error,
        isError,
        data: formattedData as TransportadorCnpjResponseData[],
        errorMessage: "Erro ao carregar CNPJs",
        contentFunction: contentFunction,
        beforeContent: () => <TransportadorFilialDetailsHeader />
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
                Tem certeza que deseja deletar o transportador {selectedSimilar?.nome ? selectedSimilar?.nome : selectedSimilar?.cnpj}?
            </DeleteModal>

            <TransportadorFilialDetailsEditModal
                hide={hideEditModal}
                setHide={setHideEditModal}
                data={selectedSimilar}
            />

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
