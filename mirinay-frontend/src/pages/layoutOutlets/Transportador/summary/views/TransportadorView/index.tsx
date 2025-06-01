import {useCallback, useState} from "react";
import useView from "../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../components/view/ViewContainer";
import TransportadorTable from "../../tables/TransportadorTable/index.tsx";
import TransportadorSubmitForm from "../../forms/TransportadorSubmitForm/index.tsx";
import TransportadorResponseData from "../../../../../../models/transportador/response/TransportadorResponseData.ts";

/**
 * Gerencia a comunicação entre os componentes da view de produto
 * @constructor
 */
export default function TransportadorView(){
    const [ transportador, setTransportador ] = useState<TransportadorResponseData>();
    const context = useView();

    // handleInsert function
    const handleInsert = useCallback((info: TransportadorResponseData) => {
        if (info) {
            setTimeout(() => setTransportador(info), 0);
        }

        // usa o setIsModalVisible para abrir o modal de forma que não atualize o estado da tabela de produto
        context.setIsSubmitContainerVisible((prevState) => {
            if (!prevState) {
                return true;
            }
            else{
                return prevState;
            }
        })
    }, [context]);

    return (
        <ViewContainer>
            <TransportadorTable handleInsert={handleInsert}/>
            <TransportadorSubmitForm transportador={transportador}/>
        </ViewContainer>
    );
}
