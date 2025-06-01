import {TableContainer} from "../../../../../components/table/TableContainer";
import ViewProvider from "../../../../../contexts/view/ViewProvider";
import PedidoBottomSection from "../sections/PedidoBottomSection";

import "./style.css";
import PedidoDetailsBarContent from "../../components/PedidoDetailBarContent";
import {memo, useState} from "react";
import {useParams} from "react-router-dom";
import DetailsProvider from "../../../../../contexts/details/DetailsProvider";
import PedidoTopSection from "../sections/PedidoTopSection";
import NfeEnum from "../../../../../enums/NfeEnum.ts";

/**
 * Gerencia a comunicação entre as seções e os dados globais de detalhes de grupo
 * @constructor
 */

//const dataEnum: NfeEnum = NfeEnum.ENCONTRADA;

const PedidoDetails = memo( function PedidoDetails() {
    const pedidoId = useParams().pedidoId as unknown as number;
    const [ dataNfeEnum, setDataNfeEnum ] = useState<NfeEnum | undefined>(undefined);

    return (
        <DetailsProvider>
            <TableContainer barContent={
                <PedidoDetailsBarContent data={dataNfeEnum} pedidoId={pedidoId} />}
            >

                <div className={"details-container"}>
                    {/*//top*/}
                    <ViewProvider>
                        <PedidoTopSection setDataNfeEnum={setDataNfeEnum}/>
                    </ViewProvider>

                    {/*/bottom/*/}
                    <ViewProvider>
                        <PedidoBottomSection/>
                    </ViewProvider>
                </div>
            </TableContainer>
        </DetailsProvider>
    );
});

export default PedidoDetails;
