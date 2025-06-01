import React, {ReactNode, useEffect, useState} from "react";
import {Loading} from "../components/misc/Loading";
import randomKey from "../utils/randomKey.ts";
import {useErrorHandling} from "./useErrorHandling.ts";


interface useTableContentProps<T> {
    isLoading: boolean,
    error: Error | null,
    isError: boolean,
    data: T[] | null,
    errorMessage: string,
    beforeContent?: () => ReactNode,
    contentFunction: (dados: T, index: number) => ReactNode,
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
export default function useFormTableContent<T> ( {
    isLoading,
    error,
    isError,
    data,
    errorMessage,
    beforeContent = () => null,
    contentFunction
} : useTableContentProps<T>): ReactNode{
    const [tableContent, setTableContent] = useState<ReactNode>();

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
            if (Array.isArray(data)){
                content = data.map((dados, index) => {
                    return (
                        <React.Fragment key={randomKey()}>
                            {contentFunctionRef.current(dados, index)}
                        </React.Fragment>
                    )
                });
            }
        }
        else{
            content = (<Loading />)
        }

        setTableContent(() => {
            return (
                <>
                    {beforeContentRef.current()}
                    {content}
                </>
            );
        });
    }, [contentFunctionRef, beforeContentRef,
        data, isError, isLoading]);

    // Error handling
    useErrorHandling(isError, error, errorMessage);

    return tableContent;
}
