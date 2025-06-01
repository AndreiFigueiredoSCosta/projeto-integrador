import React, {ReactNode, useEffect, useState} from "react";
import randomKey from "../utils/randomKey.ts";
import LoadingRow from "../components/table/LoadingRow";
import {useErrorHandling} from "./useErrorHandling.ts";
import ReloadTable from "../components/table/ReloadTable";
import {P} from "../components/text/P";
import useView from "./useView.ts";
import {ActionButton} from "../components/buttons/action/ActionButton";
import ViewProperties, {defaultViewProperties} from "../models/view/ViewProperties.ts";

interface useTableContentProps<T> {
    isLoading: boolean,
    error: Error | null,
    isError: boolean,
    data: T[] | null,
    errorMessage: string,
    beforeContent?: () => ReactNode,
    contentFunction: (dados: T, index: number) => ReactNode,
    limited?: boolean,
    currentView?: ViewProperties
}

/**
 * Hook para gerenciar o conteúdo de uma tabela
 * @param isLoading - Estado de carregamento
 * @param error - Erro
 * @param isError - Estado de erro
 * @param data - Dados
 * @param errorMessage - Mensagem de erro
 * @param staticCallback - Componente estático a ser colocado antes dos do contentFunction
 * @param contentFunction - Função de contentFunction (o que deve ser mapeado e renderizado na tabela)
 */
export default function useTableContent<T> ( {
    isLoading,
    error,
    isError,
    data,
    errorMessage,
    beforeContent = () => null,
    contentFunction,
    currentView = defaultViewProperties,
    limited = true
} : useTableContentProps<T>): ReactNode{
    const [tableContent, setTableContent] = useState<ReactNode>();
    const { setCanNavRight, setViewItens, setCanNavLeft, refreshView, maxItens } = useView();

    const contentFunctionRef = React.useRef(contentFunction);
    const beforeContentRef = React.useRef(beforeContent);

    // Atualiza as referências
    useEffect(() => {
        contentFunctionRef.current = contentFunction;
    }, [contentFunction]);
    useEffect(() => {
        beforeContentRef.current = beforeContent;
    }, [beforeContent]);

    // Content handling
    useEffect(() => {
        let content = null;

        if (!isLoading){
            if (data && limited){
                if (data.length === maxItens + 1){
                    setCanNavRight(true);
                    data.pop();
                }
                else{
                    setCanNavRight(false);
                }

                if (currentView.showedItens >= maxItens){
                    setCanNavLeft(true);
                }
                else{
                    setCanNavLeft(false);
                }

                setViewItens(data.length);
            }

            if (Array.isArray(data)){
                content = data.map((dados, index) => {
                    return (
                        <React.Fragment key={randomKey()}>
                            {contentFunctionRef.current(dados, index)}
                        </React.Fragment>
                    )
                });
            }
            else if (isError){
                content = (
                    <React.Fragment key={randomKey()}>
                        <ReloadTable toggleRequest={refreshView} />
                    </React.Fragment>
                );
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
                Array.from({ length: 16 }, (_, i) => (
                        <React.Fragment key={randomKey()}>
                            <LoadingRow stripped={i%2 == 1} />
                        </React.Fragment>
                    )
                )
            )
        }

        setTableContent(() => {
            return (
                <>
                    {beforeContentRef.current()}
                    {content}
                </>
            );
        });
    }, [contentFunctionRef, currentView.showedItens, beforeContentRef,
        data, limited, isError, isLoading, setCanNavLeft, setCanNavRight,
        setViewItens, refreshView, maxItens]);

    // Error handling
    useErrorHandling(isError, error, errorMessage);

    return tableContent;
}
