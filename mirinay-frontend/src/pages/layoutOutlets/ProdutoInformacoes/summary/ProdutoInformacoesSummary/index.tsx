import ViewManager from "../../../../../components/view/ViewManager";
import {useEffect} from "react";
import useView from "../../../../../hooks/useView.ts";
import ViewProperties, {defaultViewProperties} from "../../../../../models/view/ViewProperties.ts";
import ProdutoInformacoesView from "../views/ProdutoInformacoesView";
import SummaryContainer from "../../../../../components/table/SummaryContainer";
import SearchProvider from "../../../../../contexts/search/SearchProvider";

/**
 * Gerencia as views de Unidade e Marca
 * @constructor
 */
export default function ProdutoInformacoesSummary(){
    const {setCurrentView, addView, currentView} = useView();

    // Hook usado para setar as propriedades iniciais das views
    useEffect(() => {
        if (!currentView.title) {
            const unidadeView = {
                ...defaultViewProperties,
                title: "unidade",
            } as ViewProperties;

            const marcaView = {
                ...defaultViewProperties,
                title: "marca",
            }

            addView(marcaView);
            addView(unidadeView);
            setCurrentView(marcaView);
        }
    }, [currentView, addView, setCurrentView]);

    return (
        <SummaryContainer title={"Informações"}>
            <SearchProvider>
                <ViewManager hasSubmitContainer={true} size={"large"}/>
                <ProdutoInformacoesView />
            </SearchProvider>
        </SummaryContainer>
    );
}
