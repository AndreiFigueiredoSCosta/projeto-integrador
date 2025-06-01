import {ReactNode, useCallback, useEffect, useState} from "react";
import SearchContext from "../SearchContext";
import useView from "../../../hooks/useView.ts";
import {defaultViewProperties} from "../../../models/view/ViewProperties.ts";
import useToastManager from "../../../hooks/useToastManager.ts";

export interface SearchViewProperties {
    title: string;
    endpoint: (label: string) => string;
    page: number;
    limit: number;
    showedItens: number;
}

/**
 * Providencia propriedades padrões para pesquisa
 * @param children
 * @constructor
 */
export default function SearchProvider({children} : {children?: ReactNode}){
    const { currentView } = useView();
    const { warning } = useToastManager();

    const [ isSearching, setIsSearching ] = useState(false);
    const [ searchValue, setSearchValue ] = useState("");
    const [ currentEndpoint, setCurrentEndpoint ] = useState("");
    const [ searchViews, setSearchViews ] = useState<SearchViewProperties[]>([]);
    const [ currentSearchView, setCurrentSearchView ] = useState<SearchViewProperties>({} as SearchViewProperties);

    const updateEndpoint = useCallback(() => {
        if (isSearching){
            return setCurrentEndpoint(`${currentSearchView.endpoint(searchValue)}&page=${currentSearchView.page}&size=${currentSearchView.limit}`);
        }
        else{
            return setCurrentEndpoint(`${currentView.endpoint}?page=${currentView.page}&size=${currentView.limit}`);
        }
    }, [isSearching, currentView.endpoint, searchValue, currentSearchView, currentView.page, currentView.limit]);

    useEffect(() => {
        updateEndpoint();
    }, [updateEndpoint]);

    // Adiciona uma view ao provider
    const addSearchView = useCallback(function addView(title: string, endpoint: (label: string) => string) {
        return setSearchViews((prevState) => {
            if (!prevState.find(view => view.title === title)){
                prevState.push({
                    page: defaultViewProperties.page,
                    limit: defaultViewProperties.limit,
                    showedItens: defaultViewProperties.showedItens,
                    title,
                    endpoint
                } as SearchViewProperties)
            }

            return prevState;
        });
    }, []);

    const changeSearchView = (title: string) => {
        const newView = searchViews.find(view => view.title === title);
        if (currentSearchView){
            currentSearchView.page = defaultViewProperties.page;
            currentSearchView.limit = defaultViewProperties.limit;
        }

        if (newView) {
            return setCurrentSearchView(newView);
        }
        else{
            warning("Ops!", "Ocorreu algum erro ao tentar mudar o tipo de pesquisa");
            console.error("View não encontrada");
        }
    }

    return (
        <SearchContext.Provider value={{
            isSearching,
            setIsSearching,
            searchValue,
            setSearchValue,
            currentEndpoint,
            addSearchView,
            changeSearchView,
            currentSearchView,
            searchViews
        }}>
            {children}
        </SearchContext.Provider>
    );
}
