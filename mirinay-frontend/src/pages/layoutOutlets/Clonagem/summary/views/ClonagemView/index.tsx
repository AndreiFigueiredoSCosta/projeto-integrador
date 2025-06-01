import {useCallback, useState} from "react";
import useView from "../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../components/view/ViewContainer";
import ClonagemTable from "../../tables/ClonagemTable";
import ClonagemSubmitForm from "../../forms/ClonagemSubmitForm";
import ClonagemResponseData from "../../../../../../models/clonagem/response/ClonagemResponseData.ts";

/**
 * Gerencia a comunicação entre os componentes da view de Clonagem
 * @constructor
 */
export default function ClonagemView(){
    const [ clonagemSelecionada, setClonagemSelecionada ] = useState<ClonagemResponseData>();
    const {setIsSubmitContainerVisible} = useView();

    // Função usada para pegar a clonagem da linha que foi clicado o botão inserir
    const handleInsert = useCallback((info: ClonagemResponseData) => {
        if (info) {
            setClonagemSelecionada(undefined);
            setTimeout(() => setClonagemSelecionada(info), 0); // contentFunction function usada para setar a clonagem
            // selecionada de maneira síncrona
        }

        // usa o setIsModalVisible para abrir o modal de forma que não atualize o estado da tabela de grupo
        setIsSubmitContainerVisible((prevState) => {
            if (!prevState) {
                return true;
            }
            else{
                return prevState;
            }
        })
    }, [setIsSubmitContainerVisible]);

    return (
        <ViewContainer>
            <ClonagemTable handleInsert={handleInsert}/>
            <ClonagemSubmitForm clonagem={clonagemSelecionada}/>
        </ViewContainer>
    );
}
