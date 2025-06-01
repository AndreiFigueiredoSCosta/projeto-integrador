import React, {ReactNode, useEffect, useState} from "react";
import useView from "./useView.ts";
import randomKey from "../utils/randomKey.ts";
import {P} from "../components/text/P";
import {ActionButton} from "../components/buttons/action/ActionButton";
import LoadingKanbanItem from "../components/kanban/LoadingKanbanItem";

type useDataTableContentType<T> = {
    isLoading: boolean,
    data: T[] | null,
    contentFunction: (data: T, index: number) => ReactNode,
    filterHeader: string,
    filterValue: string | string[]
}

export default function useKanbanColContentFilter<T>({
                                          isLoading,
                                          contentFunction,
                                          data,
                                          filterHeader,
                                          filterValue}
                                          : useDataTableContentType<T>) : ReactNode {
    const [ kanbanContent, setKanbanContent ] = useState<ReactNode>();
    const { refreshView } = useView();
    const contentFunctionRef = React.useRef(contentFunction);

    const contentFilter = (data: T[]) => {
        let filterArray = null;
        if (!(Array.isArray(filterValue))){
            filterArray = [filterValue];
        }
        else{
            filterArray = filterValue;
        }

        const filteredData = data.filter((item) => {
            return filterArray.some((filter) => (item as any)[filterHeader] === filter);
        });


        if (filteredData.length > 0){
            return filteredData;
        }
        else {
            return null
        }
    }

    // Atualiza as referências
    useEffect(() => {
        contentFunctionRef.current = contentFunction;
    }, [contentFunction]);

    // Content handling
    useEffect(() => {
        let content = null;

        if (!isLoading){
            if (Array.isArray(data)){
                const filteredData = contentFilter(data);
                if (filteredData){
                    content = filteredData.map((dados: T, index) => {
                        return (
                            <React.Fragment key={randomKey()}>
                                {contentFunctionRef.current(dados, index)}
                            </React.Fragment>
                        )
                    });
                }
            }
            else{
                content = (
                    <React.Fragment key={randomKey()}>
                        <P bold={true} uppercase={true} color={"black"} variant={"xxlarge"} align={"middle"} justify={"center"}>
                            Não há dados para essa tabela...
                        </P>
                        <ActionButton variant={"cancel"} size={"large"} onClick={refreshView}>
                            Recarregar
                        </ActionButton>
                    </React.Fragment>
                );
            }
        }
        else{
            // Loading content
            content = (
                Array.from({ length: 5 }, (_) => (
                        <React.Fragment key={randomKey()}>
                            <LoadingKanbanItem />
                        </React.Fragment>
                    )
                )
            )
        }

        setKanbanContent(() => {
            return (
                <>
                    {content}
                </>
            );
        });
    }, [contentFunctionRef, data, isLoading, refreshView, filterValue]);

    return kanbanContent;
}
