import ViewManager from "../../../../../components/view/ViewManager/index.tsx";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import SummaryContainer from "../../../../../components/table/SummaryContainer/index.tsx";
import useSearch from "../../../../../hooks/useSearch.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import MargemView from "../views/ClientesView/index.tsx";
import ClientesView from "../views/ClientesView/index.tsx";

/**
 * Gerencia a view de Grupo
 * @constructor
 */
export default function ClientesSummary(){
    const {setCurrentView, addView, currentView} = useView();
    const { addSearchView } = useSearch();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const view = {
                ...defaultViewProperties,
                title: "Clientes"
            } as ViewProperties;

            addView(view);

            addSearchView("Número", useEndpoint().cliente().GET().buscarPorNumero);
            addSearchView("Nome", useEndpoint().cliente().GET().buscarPeloNome);
            addSearchView("CPF", useEndpoint().cliente().GET().buscarPeloNomeCpf);

            return setCurrentView(view);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Clientes"}>
            <ViewManager hasSubmitContainer={true} size={"large"}/>
            <ClientesView />
        </SummaryContainer>
    );
}
