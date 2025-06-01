import {SearchInput} from "../../form/input/SearchInput";
import {P} from "../../text/P";
import "./style.css";
import useView from "../../../hooks/useView.ts";
import PageNavigationManager from "../PageNavigationManager";
import {ReactNode, useEffect, useState} from "react";
import useSearch from "../../../hooks/useSearch.ts";
import ViewProperties from "../../../models/view/ViewProperties.ts";
import {Select} from "../../form/select/Select";
import {SelectOption} from "../../../types/SelectOption.ts";
import {SearchViewProperties} from "../../../contexts/search/SearchProvider";

type DefaultViewBarContentProps = {
    hasSearch?: boolean;
    hasPagination?: boolean;
    leftSideContent?: ReactNode;
    middleContent?: ReactNode;
    rightSideContent?: ReactNode;
    minToSearch?: number;
}

export default function TopBarContent({
                                                  hasSearch = true,
                                                  middleContent,
                                                  rightSideContent,
                                                  leftSideContent,
                                                  minToSearch = 3,
                                                  hasPagination = true} : DefaultViewBarContentProps){
    const { currentView, viewItens, refreshView } = useView();
    const { setIsSearching, setSearchValue, searchValue, currentSearchView, isSearching, searchViews, changeSearchView } = useSearch();
    const [ selectedView, setSelectedView ] = useState<SelectOption | null>()
    const [ manipulatedView, setManipulatedView ] = useState<ViewProperties | SearchViewProperties>(currentView);

    useEffect(() => {
        if (searchValue.length < minToSearch){
            setIsSearching(false);
        }
    }, [setIsSearching, searchValue]);

    const convertViewsToOptions = (views: SearchViewProperties[]) => {
        return views.map((view) => {
            return {
                label: view.title,
                value: view.title
            } as SelectOption
        })
    }

    useEffect(() => {
        if (selectedView){
            changeSearchView(selectedView.value as string);
        }
    }, [selectedView]);

    useEffect(() => {
        if (isSearching){
            setManipulatedView(currentSearchView);
        }
        else{
            setManipulatedView(currentView);
        }
    }, [isSearching, changeSearchView, currentView]);

    return (
        <div className={`bar-content`}>
            <div className={`leftside-content`}>
                {
                    hasSearch &&
                        <div className={`top-bar-search-container`}>
                            <SearchInput
                                label={"Pesquisar"}
                                name={"search"}
                                value={searchValue}
                                onChange={(e) => { setSearchValue(e) }}
                                btnDisabled={!selectedView}
                                onSubmit={() => {
                                    setIsSearching(true);
                                    refreshView();
                                }}
                                minToSearch={minToSearch}
                            />

                            <Select
                                label={"Tipo"}
                                options={convertViewsToOptions(searchViews)}
                                name={"pesquisaType"}
                                isSearchable={false}
                                value={selectedView}
                                onChange={(value) => {
                                    setSelectedView(value);
                                }}
                                style={{
                                    minWidth: "200px",
                                    maxWidth: "200px"
                                }}
                            />
                        </div>
                }
                {leftSideContent}
            </div>
            <div className={`middle-content`}>
                {middleContent}
            </div>
            <div className={`rightside-content`}>
                {rightSideContent}
                {
                    hasPagination &&
                        <div className={"nav-container"}>
                            <P>{manipulatedView.showedItens} - {(manipulatedView.showedItens + viewItens) || 0} itens</P>
                            <PageNavigationManager currentView={manipulatedView}/>
                        </div>
                }
            </div>
        </div>
    );
}
