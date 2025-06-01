import {TableContainer} from "../../../../../../../components/table/TableContainer";
import {useFetch} from "../../../../../../../hooks/useFetch.ts";
import {useCallback, useEffect, useState} from "react";
import useEndpoint from "../../../../../../../hooks/useEndpoint.ts";
import {useParams} from "react-router-dom";
import SubgrupoResponseData from "../../../../../../../models/grupo/response/SubgrupoResponseData.ts";
import SubgrupoDetailsRow from "../../../../components/rows/SubgrupoDetailsRow";
import SubgrupoDetailsHeader from "../../../../components/headers/SubgrupoDetailsHeader";
import useTableContent from "../../../../../../../hooks/useTableContent.tsx";
import useDetails from "../../../../../../../hooks/useDetails.ts";
import useView from "../../../../../../../hooks/useView.ts";
import DeleteModal from "../../../../../../../components/modals/DeleteModal";
import SubgrupoDetailsEditModal from "../../modals/SubgrupoEditModal";

/**
 * Tabela de detalhes de subgrupos
 * @constructor
 */
export default function GrupoSubgrupoDetailsTable() {
    const grupoId = useParams().grupoId as unknown as number;
    const { globalRefresh, refreshDetails } = useDetails();
    const { refresh, refreshView } = useView();
    const [ subgrupoId, setSubgrupoId ] = useState<number | undefined>(undefined);
    const endpoint = `${useEndpoint().grupo().informacoes(grupoId).subgrupos}`;
    const deleteEndpoint = useEndpoint().subgrupo().operacoes(subgrupoId).deletar;
    const { toggleRequest, data, isLoading, error, isError } = useFetch<SubgrupoResponseData>(endpoint);
    const [ selectedSubgrupo, setSelectedSubgrupo ] = useState<SubgrupoResponseData>();
    const [ hideDeleteModal, setHideDeleteModal ] = useState(true);
    const [ hideEditModal, setHideEditModal ] = useState(true);

    // Incializa a requisição
    useEffect(() => {
        toggleRequest();
    }, [toggleRequest, globalRefresh, refresh]);

    // Função de clique para cada linha da tabela, abre modais de edição e exclusão
    const handleClick = useCallback(
        function handleClick(action: string, subgrupo?: SubgrupoResponseData) {

        switch (action){
            case "edit":
                setSelectedSubgrupo(subgrupo);
                setHideEditModal(false);
                break;
            case "delete":
                setSubgrupoId(subgrupo?.subgrupoId);
                setHideDeleteModal(false);
                break;
        }
    }, []);

    // Função de renderização de conteúdo
    const contentFunction =
        (dados: SubgrupoResponseData, index: number) => {
        return (
            <SubgrupoDetailsRow
                stripped={index % 2 == 1}
                data={dados}
                deleteFunction={() => handleClick("delete", dados)}
                editFunction={() => handleClick("edit", dados)}
            />
        );
    }

    // Renderiza o conteúdo da tabela
    const content = useTableContent<SubgrupoResponseData>({
        isLoading,
        error,
        isError,
        data: data as SubgrupoResponseData[],
        errorMessage: "Erro ao carregar subgrupos",
        contentFunction: contentFunction,
        beforeContent: () => <SubgrupoDetailsHeader />
    });

    return (
        <>
            <DeleteModal
                hide={hideDeleteModal}
                setHide={setHideDeleteModal}
                request={deleteEndpoint}
                errorMessage={"Erro ao deletar o subgrupo."}
                successMessage={"Subgrupo deletado com sucesso!"}
                onDelete={
                    () => {
                        refreshDetails();
                        refreshView();
                    }
                }
            >
                Tem certeza que deseja deletar o subgrupo {selectedSubgrupo?.nome}?
            </DeleteModal>

            <SubgrupoDetailsEditModal
                hide={hideEditModal}
                setHide={setHideEditModal}
                subgrupo={selectedSubgrupo}
            />

            <TableContainer size={"small"} >
                {content}
            </TableContainer>
        </>
    );
}
