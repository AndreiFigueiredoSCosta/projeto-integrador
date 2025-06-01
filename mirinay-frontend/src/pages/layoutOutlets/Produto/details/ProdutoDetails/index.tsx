import {TableContainer} from "../../../../../components/table/TableContainer";
import ViewProvider from "../../../../../contexts/view/ViewProvider";

import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {memo, useState} from "react";
import {useParams} from "react-router-dom";
import DeleteModal from "../../../../../components/modals/DeleteModal";
import DetailsProvider from "../../../../../contexts/details/DetailsProvider";
import ProdutoDetailsEditModal from "../sections/modals/ProdutoDetailsEditModal";
import ProdutoDetailBarContent from "../../components/ProdutoDetailBarContent";
import ProdutoTopSection from "../sections/ProdutoTopSection";
import ProdutoBottomSections from "../sections/ProdutoBottomSections";
import DetailsContainer from "../../../../../components/table/DetailsContainer";

/**
 * Gerencia a comunicação entre as seções e os dados globais de detalhes de prodtuo
 * @constructor
 */
const ProdutoDetails = memo( function ProdutoDetails(){
    const produtoId = useParams().produtoId as unknown as number;
    const produtoDeleteEndpoint = useEndpoint().produto().operacoes(produtoId).deletar;
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
                <ProdutoDetailBarContent
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
                errorMessage={"Erro ao deletar produto."}
                successMessage={"Produto deletado com sucesso."}
                request={produtoDeleteEndpoint}
                redirect={"/produto"}
            >
                Deseja realmente excluir esse produto?
            </DeleteModal>

            <ProdutoDetailsEditModal
                hide={editHide}
                setHide={setEditHide} />

                <DetailsContainer>
                    {/*//top*/}
                    <ViewProvider>
                        <ProdutoTopSection />
                    </ViewProvider>

                    {/*/bottom/*/}
                    <ViewProvider>
                        <ProdutoBottomSections />
                    </ViewProvider>

                </DetailsContainer>
            </TableContainer>
        </DetailsProvider>
    );
});

export default ProdutoDetails;
