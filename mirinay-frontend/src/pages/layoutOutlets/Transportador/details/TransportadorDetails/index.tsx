import {TableContainer} from "../../../../../components/table/TableContainer";
import ViewProvider from "../../../../../contexts/view/ViewProvider";

import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {memo, useState} from "react";
import {useParams} from "react-router-dom";
import DeleteModal from "../../../../../components/modals/DeleteModal";
import DetailsProvider from "../../../../../contexts/details/DetailsProvider";
import TransportadorTopSection from "../sections/TransportadorTopSection";
import TransportadorBottomSection from "../sections/TransportadorBottomSection";
import TransportadorDetailsEditModal from "../sections/modals/TransportadorDetailsEditModal";
import TransportadorDetailsBarContent from "../../components/TransportadorDetailsBarContent";
import DetailsContainer from "../../../../../components/table/DetailsContainer";

/**
 * Gerencia a comunicação entre as seções e os dados globais de detalhes de prodtuo
 * @constructor
 */
const TransportadorDetails = memo( function TransportadorDetails(){
    const id = useParams().transportadorId as unknown as number;
    const deleteEndpoint = useEndpoint().transportador().operacoes(id).deletar;
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
                <TransportadorDetailsBarContent
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
                errorMessage={"Erro ao deletar transportador."}
                successMessage={"Transportador deletado com sucesso."}
                request={deleteEndpoint}
                redirect={"/transportador"}
            >
                Deseja realmente excluir esse transportador?
            </DeleteModal>

            <TransportadorDetailsEditModal
                hide={editHide}
                setHide={setEditHide} />

                <DetailsContainer>
                    {/*//top*/}
                    <ViewProvider>
                        <TransportadorTopSection />
                    </ViewProvider>

                    {/*/bottom/*/}
                    <ViewProvider>
                        <TransportadorBottomSection />
                    </ViewProvider>

                </DetailsContainer>
            </TableContainer>
        </DetailsProvider>
    );
});

export default TransportadorDetails;
