import {ReactNode, useEffect, useState} from "react";
import useDetails from "./useDetails.ts";
import ReloadTable from "../components/table/ReloadTable";
import LoadingTable from "../components/table/LoadingTable";
import {useErrorHandling} from "./useErrorHandling.ts";
import useView from "./useView.ts";

type useDataTableContentType<T> = {
    isLoading: boolean,
    isError: boolean,
    error: Error | null,
    isSuccess: boolean,
    contentFunction: () => ReactNode,
    data: T,
    errorMessage: string
}

export default function useDataTableContent<T>({
                                                   isLoading,
                                                   isError,
                                                   error,
                                                   contentFunction,
                                                   isSuccess,
                                                   data,
                                                   errorMessage}
                                                   : useDataTableContentType<T>) : ReactNode {
    const [ tableContent, setTableContent ] = useState<ReactNode>();
    const { setData, setIsLoading, globalRefresh } = useDetails();
    const { refreshView, refresh } = useView();

    // Atualiza o estado global de detalhes de acordo com o retorno da requisição
    useEffect(() => {
        if (isSuccess){
            setData(data);
        }
    }, [data, isSuccess, setData, globalRefresh, refresh]);

    // Atualiza o estado global de carregamento de acordo com o retorno da requisição
    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading, setIsLoading]);

    // Content handling
    useEffect(() => {
        let tableContent: ReactNode;

        // Se não estiver carregando, exibe os dados
        if (!isLoading){
            if (data){
                tableContent = contentFunction();
            }
            else{
                // Se não houver dados, exibe a tabela de recarregamento
                tableContent = (
                    <ReloadTable toggleRequest={refreshView} />
                );
            }
        }
        else{
            // Se estiver carregando, exibe a tabela de carregamento
            tableContent = (
                <LoadingTable />
            );
        }

        setTableContent(tableContent);
    }, [contentFunction, data, isLoading, globalRefresh, refreshView]);

    // Trata erros de requisição
    useErrorHandling(isError, error, errorMessage);

    return tableContent;
}
