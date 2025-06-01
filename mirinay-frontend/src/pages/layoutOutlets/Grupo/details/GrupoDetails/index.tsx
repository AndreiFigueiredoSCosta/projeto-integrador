import {TableContainer} from "../../../../../components/table/TableContainer";
import ViewProvider from "../../../../../contexts/view/ViewProvider";
import GrupoBottomSection from "../sections/GrupoBottomSection";
import GrupoTopSection from "../sections/GrupoTopSection";

import GrupoDetailsBarContent from "../../components/GrupoDetailBarContent";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {memo, useState} from "react";
import {useParams} from "react-router-dom";
import DeleteModal from "../../../../../components/modals/DeleteModal";
import GrupoDetailsEditModal from "../sections/modals/GrupoDetailsEditModal";
import DetailsProvider from "../../../../../contexts/details/DetailsProvider";
import DetailsContainer from "../../../../../components/table/DetailsContainer";

/**
 * Gerencia a comunicação entre as seções e os dados globais de detalhes de grupo
 * @constructor
 */
const GrupoDetails = memo( function GrupoDetails(){
    const grupoId = useParams().grupoId as unknown as number;
    const grupoDeleteEndpoint = useEndpoint().grupo().operacoes(grupoId).deletar;
    const [ deleteHide, setDeleteHide ] = useState<boolean>(true);
    const [ editHide, setEditHide ] = useState<boolean>(true);

    const handleClick = (type: string) => {
        switch (type){
            case "delete":
                setDeleteHide(false);
                break;
            case "edit":
                setEditHide(false);
                break;
            default:
                break;
        }
    }

    return (
        <DetailsProvider>
            <TableContainer barContent={
                <GrupoDetailsBarContent
                    onDeleteClick={() => {
                        handleClick("delete")
                    }}
                    onEditClick={() => {
                        handleClick("edit")
                    }}
                />}
            >
            <DeleteModal
                hide={deleteHide}
                setHide={setDeleteHide}
                errorMessage={"Erro ao deletar grupo."}
                successMessage={"Grupo deletado com sucesso."}
                request={grupoDeleteEndpoint}
                redirect={"/grupo"}
            >
                Deseja realmente excluir esse grupo?
            </DeleteModal>

            <GrupoDetailsEditModal
                hide={editHide}
                setHide={setEditHide} />

                <DetailsContainer>
                    {/*//top*/}
                    <ViewProvider>
                        <GrupoTopSection/>
                    </ViewProvider>

                    {/*/bottom/*/}
                    <ViewProvider>
                        <GrupoBottomSection/>
                    </ViewProvider>

                </DetailsContainer>
            </TableContainer>
        </DetailsProvider>
    );
});

export default GrupoDetails;
