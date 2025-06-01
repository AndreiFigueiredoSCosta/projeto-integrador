import {TableContainer} from "../../../../../components/table/TableContainer";
import ViewProvider from "../../../../../contexts/view/ViewProvider";

import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {memo, useState} from "react";
import {useParams} from "react-router-dom";
import DeleteModal from "../../../../../components/modals/DeleteModal";
import DetailsProvider from "../../../../../contexts/details/DetailsProvider";
import FornecedorTopSection from "../sections/FornecedorTopSection";
import FornecedorBottomSection from "../sections/FornecedorBottomSection";
import FornecedorDetailsEditModal from "../sections/modals/FornecedorDetailsEditModal";
import FornecedorDetailsBarContent from "../../components/FornecedorDetailsBarContent";
import DetailsContainer from "../../../../../components/table/DetailsContainer";

/**
 * Gerencia a comunicação entre as seções e os dados globais de detalhes de prodtuo
 * @constructor
 */
const FornecedorDetails = memo( function FornecedorDetails(){
    const id = useParams().fornecedorId as unknown as number;
    const deleteEndpoint = useEndpoint().fornecedor().operacoes(id).deletar;
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
                <FornecedorDetailsBarContent
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
                errorMessage={"Erro ao deletar fornecedor."}
                successMessage={"Fornecedor deletado com sucesso."}
                request={deleteEndpoint}
                redirect={"/fornecedor"}
            >
                Deseja realmente excluir esse fornecedor?
            </DeleteModal>

            <FornecedorDetailsEditModal
                hide={editHide}
                setHide={setEditHide} />

                <DetailsContainer>
                    {/*//top*/}
                    <ViewProvider>
                        <FornecedorTopSection />
                    </ViewProvider>

                    {/*/bottom/*/}
                    <ViewProvider>
                        <FornecedorBottomSection />
                    </ViewProvider>

                </DetailsContainer>
            </TableContainer>
        </DetailsProvider>
    );
});

export default FornecedorDetails;
