import GrupoTable from "../../tables/GrupoTable";
import GrupoSubgrupoSubmitForm from "../../forms/GrupoSubgrupoSubmitForm";
import {useCallback, useState} from "react";
import useView from "../../../../../../hooks/useView.ts";
import ViewContainer from "../../../../../../components/view/ViewContainer";
import GrupoResponseData from "../../../../../../models/grupo/response/GrupoResponseData.ts";

/**
 * Gerencia a comunicação entre os componentes da view de Grupo
 * @constructor
 */
export default function GrupoView(){
    const [ grupoSelecionado, setGrupoSelecionado ] = useState<GrupoResponseData>();
    const {setIsSubmitContainerVisible} = useView();

    // Função usada para pegar o grupo da linha que foi clicado o botão inserir inserir
    const handleInsert = useCallback((info: GrupoResponseData) => {
        if (info) {
            setTimeout(() => setGrupoSelecionado(info), 0); // contentFunction function usada para setar o grupo
            // selecionado de maneira síncrona
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
            <GrupoTable handleInsert={handleInsert}/>
            <GrupoSubgrupoSubmitForm grupo={grupoSelecionado}/>
        </ViewContainer>
    );
}
