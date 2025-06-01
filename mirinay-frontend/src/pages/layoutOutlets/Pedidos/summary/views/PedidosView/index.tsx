import PedidosTable from "../../tables/PedidosTable";
import ViewContainer from "../../../../../../components/view/ViewContainer";
import useView from "../../../../../../hooks/useView.ts";
import EfetuadosTable from "../../tables/EfetuadosTable";
import SearchProvider from "../../../../../../contexts/search/SearchProvider";

/**
 * Gerencia a comunicação entre os componentes da view de Pedidos
 * @constructor
 */
export default function PedidosView(){
    const { currentView } = useView();

    switch (currentView.title){
        case "Pendentes":
            return (
                <ViewContainer>
                    <PedidosTable />
                </ViewContainer>
            );
        case "Efetuados":
            return  (
                <ViewContainer>
                    <SearchProvider>
                        <EfetuadosTable />
                    </SearchProvider>
                </ViewContainer>
            )
    }
}
