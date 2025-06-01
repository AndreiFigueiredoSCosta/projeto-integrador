import ViewManager from "../../../../../components/view/ViewManager";
import AdministracaoView from "../views/AdministracaoView";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import SearchProvider from "../../../../../contexts/search/SearchProvider";
import SummaryContainer from "../../../../../components/table/SummaryContainer";

/**
 * Gerencia a view de Pedidos
 * @constructor
 */
export default function AdministracaoSummary() {
    const {setCurrentView, addView, currentView} = useView();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const pendentesView = {
                ...defaultViewProperties,
                title: "Pendentes"
            } as ViewProperties;

            const efetuadosView = {
                ...defaultViewProperties,
                title: "Efetuados"
            } as ViewProperties;

            const usuariosView = {
                ...defaultViewProperties,
                title: "Usuarios"
            } as ViewProperties;

            addView(pendentesView);
            addView(efetuadosView);
            addView(usuariosView);

            setCurrentView(pendentesView);
        }
    }, [currentView, addView, setCurrentView])

    return (
        <SearchProvider>
            <SummaryContainer title={"Administração"}>
                <ViewManager hasSubmitContainer={currentView.title === "Usuarios"}
                             size={"large"}/>
                <AdministracaoView />
            </SummaryContainer>
        </SearchProvider>
    );
}
