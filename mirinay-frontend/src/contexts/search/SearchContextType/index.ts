import React from "react";
import {SearchViewProperties} from "../SearchProvider";

/**
 * Interface de todas a propriedades do contexto de pesquisa
 */
export default interface SearchContextType {
    isSearching: boolean;
    setIsSearching:  React.Dispatch<React.SetStateAction<boolean>>
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    currentEndpoint: string;
    addSearchView: (title: string, endpoint: (label: string) => string) => void;
    changeSearchView: (title: string) => void;
    currentSearchView: SearchViewProperties;
    searchViews: SearchViewProperties[];
}
