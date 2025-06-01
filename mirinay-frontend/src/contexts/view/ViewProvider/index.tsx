import {ReactNode, useCallback, useState} from "react";
import ViewContext from "../ViewContext";
import ProviderViews from "../../../models/view/ProviderViews.ts";
import ViewProperties from "../../../models/view/ViewProperties.ts";

/**
 * Providencia propriedades padrões para até 3 views
 * @param children
 * @constructor
 */
export default function ViewProvider({children} : {children?: ReactNode}){
    //Variáveis passadas pelo provider
    const [ views, setViews ] = useState({} as ProviderViews);
    const [ currentView, setCurrentView ] = useState<ViewProperties>({} as ViewProperties);
    const [ isSubmitContainerVisible, setIsSubmitContainerVisible ] = useState(false);
    const [ viewItens, setViewItens ] = useState(0);
    const [ canNavLeft, setCanNavLeft ] = useState(false);
    const [ canNavRight, setCanNavRight ] = useState(false);
    const [ refresh, setRefresh ] = useState(false);
    const [ maxItens, setMaxItens ] = useState(16);

    // Função de contentFunction usada para adicionar uma view de maneira síncrona
    const updateView = useCallback(function updateView(view: ViewProperties) {
        setViews((prevState) => {
            const updatedViews = {...prevState};

            //Checa se já existe a view adicionada
            switch (view.title){
                case prevState.primary?.title:
                    return prevState;
                case prevState.secondary?.title:
                    return prevState;
                case prevState.tertiary?.title:
                    return prevState;
            }

            //Checa qual espaço está vazio para adicionar uma nova view
            if (!prevState.primary){
                updatedViews.primary = view;
            }
            else if (!prevState.secondary){
                updatedViews.secondary = view;
            }
            else if (!prevState.tertiary){
                updatedViews.tertiary = view;
            }
            else {
                console.error("All views are already set");
            }

            return updatedViews;
        });
    }, []);

    // Adiciona uma view ao provider
    const addView = useCallback(function addView(view: ViewProperties) {

        return updateView(view);
    }, [updateView]);

    const setItens = useCallback(function addItens(itens: number) {
        return setViewItens(itens);
    }, []);

    const refreshView = useCallback(function refreshView() {
        setTimeout(() => {
            return setRefresh((prevState) => {
                return !prevState;
            });
        }, 0);
    }, []);

    return (
        <ViewContext.Provider value={{
            views,
            addView,
            currentView,
            setCurrentView,
            isSubmitContainerVisible,
            setIsSubmitContainerVisible,
            viewItens,
            setViewItens: setItens,
            canNavLeft,
            setCanNavLeft,
            canNavRight,
            setCanNavRight,
            refreshView,
            refresh,
            maxItens,
            setMaxItens
        }}>
            {children}
        </ViewContext.Provider>
    );
}
