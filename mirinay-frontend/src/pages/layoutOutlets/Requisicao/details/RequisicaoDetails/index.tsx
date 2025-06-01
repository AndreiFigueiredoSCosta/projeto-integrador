import {TableContainer} from "../../../../../components/table/TableContainer";
import ViewProvider from "../../../../../contexts/view/ViewProvider";

import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {memo, ReactNode, useState} from "react";
import {useParams} from "react-router-dom";
import DeleteModal from "../../../../../components/modals/DeleteModal";
import DetailsProvider from "../../../../../contexts/details/DetailsProvider";
import RequisicaoDetailsEditModal from "../sections/modals/RequisicaoDetailsEditModal";
import RequisicaoTopSection from "../sections/RequisicaoTopSection";
import RequisicaoDetailsBarContent from "../../components/RequisicaoDetailsBarContent";
import EstagioEnum from "../../../../../enums/EstagioEnum.ts";
import DetailsContainer from "../../../../../components/table/DetailsContainer";

/**
 * Gerencia a comunicação entre as seções e os dados globais de detalhes de grupo
 * @constructor
 */
const RequisicaoDetails = memo( function RequisicaoDetails({outlet, estagio} : {outlet: ReactNode, estagio: EstagioEnum}){
    const requisicaoId = useParams().requisicaoId as unknown as number;
    const deleteEndpoint = useEndpoint().requisicao().operacoes(requisicaoId).geral().deletar;
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
                <RequisicaoDetailsBarContent
                    onDeleteClick={() => {
                        handleClick("delete")
                    }}
                    onEditClick={() => {
                        handleClick("edit")
                    }}
                    estagio={estagio}
                />}
            >
            <DeleteModal
                hide={deleteHide}
                setHide={setDeleteHide}
                errorMessage={"Erro ao deletar a requisição."}
                successMessage={"Requisição deletada com sucesso."}
                request={deleteEndpoint}
                redirect={"/requisicao"}
            >
                Deseja realmente excluir essa requisição?
            </DeleteModal>

            <RequisicaoDetailsEditModal
                hide={editHide}
                setHide={setEditHide} />

                <DetailsContainer>
                    {/*//top*/}
                    <ViewProvider>
                        <RequisicaoTopSection />
                    </ViewProvider>

                    {/*/bottom/*/}
                    <ViewProvider>
                        {outlet}
                    </ViewProvider>

                </DetailsContainer>
            </TableContainer>
        </DetailsProvider>
    );
});

export default RequisicaoDetails;
