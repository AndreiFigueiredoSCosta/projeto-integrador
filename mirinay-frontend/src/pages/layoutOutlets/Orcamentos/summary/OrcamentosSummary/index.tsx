import ViewManager from "../../../../../components/view/ViewManager/index.tsx";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import SummaryContainer from "../../../../../components/table/SummaryContainer/index.tsx";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import OrcamentosView from "../views/OrcamentosView/index.tsx";

/**
 * Gerencia a view de Orcamentos
 * @constructor
 */
export default function OrcamentosSummary(){
    const {setCurrentView, addView, currentView} = useView();
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const orcamentosView = {
                ...defaultViewProperties,
                title: "orcamentos"
            } as ViewProperties;

            addView(orcamentosView);

            addSearchView("Número", useEndpoint().orcamentos().GET().buscarPorNumero);
            addSearchView("Vendedor", useEndpoint().orcamentos().GET().buscarPeloNomeVendedor);
            addSearchView("Cliente", useEndpoint().orcamentos().GET().buscarPeloNomeCliente);

            setCurrentView(orcamentosView);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Orcamentos"}>
            <ViewManager hasSubmitContainer={true} size={"large"} submitBtnText="Iniciar Orçamento"/>
            <OrcamentosView/>
        </SummaryContainer>
    );
}
