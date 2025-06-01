import {useCallback, useState} from "react";
import useView from "../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../components/view/ViewContainer/index.tsx";
import ClonagemTable from "../../tables/OrcamentoTable/index.tsx";
import ClonagemResponseData from "../../../../../../models/clonagem/response/ClonagemResponseData.ts";
import OrcamentoTable from "../../tables/OrcamentoTable/index.tsx";
import {OrcamentoResponseData} from "../../../../../../models/orcamentos/response/OrcamentoResponseData.ts";
import OrcamentoSubmitForm from "../../forms/OrcamentoSubmitForm/index.tsx";

/**
 * Gerencia a comunicação entre os componentes da view de Orcamento
 * @constructor
 */
export default function OrcamentosView(){
    const [orcamentoSelecionado, setOrcamentoSelecionado ] = useState<OrcamentoResponseData>();
    const {setIsSubmitContainerVisible} = useView();

    // Função usada para pegar o orçamento da linha que foi clicado o botão inserir
    const handleInsert = useCallback((info: OrcamentoResponseData) => {
        if (info) {
            setOrcamentoSelecionado(undefined);
            setTimeout(() => setOrcamentoSelecionado(info), 0); 
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
            <OrcamentoTable handleInsert={handleInsert}/>
            <OrcamentoSubmitForm />
        </ViewContainer>
    );
}
