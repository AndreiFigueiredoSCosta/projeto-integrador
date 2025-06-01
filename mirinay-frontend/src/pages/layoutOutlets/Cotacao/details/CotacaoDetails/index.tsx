import {TableContainer} from "../../../../../components/table/TableContainer";
import ViewProvider from "../../../../../contexts/view/ViewProvider";

import {memo, ReactNode} from "react";
import DetailsProvider from "../../../../../contexts/details/DetailsProvider";
import RequisicaoTopSection from "../sections/CotacaoTopSection";
import EstagioEnum from "../../../../../enums/EstagioEnum.ts";
import CotacaoDetailsBarContent from "../../components/misc/CotacaoDetailsBarContent";
import DetailsContainer from "../../../../../components/table/DetailsContainer";

/**
 * Gerencia a comunicação entre as seções e os dados globais de detalhes de grupo
 * @constructor
 */
const CotacaoDetails = memo( function CotacaoDetails({outlet, estagio} : {outlet: ReactNode, estagio: EstagioEnum}){
    return (
        <DetailsProvider>
            <TableContainer barContent={
                <CotacaoDetailsBarContent
                    estagio={estagio}
                    hasProgressbar={estagio === EstagioEnum.COTACAO || estagio === EstagioEnum.APROVACAO}
                />}
            >
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

export default CotacaoDetails;
