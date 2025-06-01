import AutorizacaoTable from "../../tables/AutorizacaoTable";
import ViewContainer from "../../../../../../components/view/ViewContainer";
import useView from "../../../../../../hooks/useView.ts";
import SearchProvider from "../../../../../../contexts/search/SearchProvider";
import AutorizacaoEfetuadasTable from "../../tables/AutorizacaoEfetuadasTable";
import UsuariosTable from "../../tables/UsuariosTable";
import UsuarioSubmitForm from "../../forms/UsuarioSubmitForm";
import {useCallback,  useState} from "react";

import AutorizacaoResponseData from "../../../../../../models/administracao/AutorizacaoResponseData.ts";
;

/**
 * Gerencia a comunicação entre os componentes da view de Pedidos
 * @constructor
 */
export default function AdministracaoView(){
    const context = useView();
    const [autorizacoes, setAutorizacoes] = useState<AutorizacaoResponseData>();


    // Função para abrir o modal de cadastro de usuário
    const handleInsert = useCallback((info: AutorizacaoResponseData) => {
        if (info) {
            setTimeout(() => setAutorizacoes(info), 0);
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
    switch (context.currentView.title) {
        case "Pendentes":
            return (
                <ViewContainer>
                    <AutorizacaoTable />
                </ViewContainer>
            );
        case "Efetuados":
            return  (
                <ViewContainer>
                    <SearchProvider>
                        <AutorizacaoEfetuadasTable />
                    </SearchProvider>
                </ViewContainer>
            );
        case "Usuarios":
            return  (
                <ViewContainer>
                    <SearchProvider>
                        <UsuariosTable handleInsert={handleInsert} />
                        <UsuarioSubmitForm autorizacoes={autorizacoes} />
                    </SearchProvider>
                </ViewContainer>
            )
    }
}
