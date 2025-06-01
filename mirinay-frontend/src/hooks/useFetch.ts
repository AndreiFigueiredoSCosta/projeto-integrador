import {useCallback, useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from 'axios';
import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {useAccessToken} from "./useAccessToken.ts";
import ErrorResponse from "../models/misc/ErrorResponse.ts";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

const API_URL = process.env.API_URL || '';

interface UseFetchResult<T> {
    data: T | T[] | null;
    isLoading: boolean
    error: Error | null;
    isError: boolean;
    toggleRequest: () => void;
    isSuccess: boolean;
}

/**
 * Hook para fazer requisições HTTP de leitura (GET).
 * @param request - URL da requisição.
 * @param body - Corpo da requisição.
 * @param options - Opções da requisição.
 * @param queryOptions - Opções do React Query
 * @returns UseFetchResult<T> - Dados e funções para executar e abortar a requisição.
 */
export const useFetch = <T>(request: string,
                            body?: Record<string | symbol, unknown>,
                            options?: AxiosRequestConfig,
                            queryOptions?: UseQueryOptions<T | T[] | undefined, Error>) : UseFetchResult<T> => {

    const accessToken = useAccessToken();
    const [ execute, setExecute ]  = useState(false);
    const [ errorResponse, setErrorResponse ] = useState<ErrorResponse | null>(null);

    const headers: Record<string, string> = {
        ...Object.fromEntries(Object.entries(options?.headers || {}).map(([key, value]) => [key, String(value)])),
    };

    // Adiciona o token de autenticação no cabeçalho da requisição.
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const updateError = (error?: Error | null) => {
        if (error && errorResponse) {
            error.name = errorResponse.mensagem;
            error.message = errorResponse?.detalhes;
        }
    }

    const updateErrorSync = (error?: Error | null) => {
        return updateError(error);
    }

    // Função para fazer a requisição HTTP.
    const fetchData = async (): Promise<T | T[] | undefined> => {
        console.log('Requesting:', request);
        try {
            const response = await axios({
                url: `${API_URL}${request}`,
                method: options?.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                data: body,
                ...options,
                timeout: 220000,
            });

            const dados = response.data;

            // Essa parte serve para tratar respostas da API que não estão padronizadas
            if (dados) {
                // Verifica se a resposta é um array ou um objeto
                if (!Array.isArray(dados) && typeof dados === 'object') {
                    if (dados._embedded) {
                        if (Object.keys(dados._embedded).length > 1) {
                            return dados as T;
                        }
                        else{
                            return Object.values(dados._embedded)[0] as T;
                        }
                    }
                    else{
                        if (Object.keys(dados).length > 1) {
                            return dados as T;
                        }
                    }
                } else {
                    return dados as T;
                }
            }
            else{
                return dados as T;
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorResponse(error.response.data as ErrorResponse);
                if (error.response.status === 401 || error.response.status === 403) {
                    Cookies.remove('access_token'); // Remove o token expirado
                    const navigate = useNavigate(); // Redireciona para a tela de login
                    navigate('/');
                }
            }
            throw error;
        }
    }

    // Executa a requisição HTTP.
    const { data = null, isLoading, error, isError, isSuccess, isFetching } = useQuery<T | T[] | undefined, Error>({
        enabled: execute,
        retry: 2,
        staleTime: 500,
        ...queryOptions,
        queryKey: [request, options],
        queryFn: fetchData
    });


    // Função para abortar a requisição. (não funciona corretamente por que o useQuery tenta enviar novamente a
    // requisição mais 3 vezes e somente uma delas é abortada)
    // const abort = useCallback(() => {
    //     abortControllerRef.current.abort();
    //     console.log('Request aborted:', request);
    // }, [request]);

    // const toggleRequest = () => {};

    const toggleRequest = useCallback(() => {
        return setTimeout(() => {
            return setExecute((prevState) => {
                return !isFetching && !prevState
            });
        }, 0);
    }, [isFetching]);

    // Resolve o bug de não atualizar o execute após clicar no toggleRequest
    useEffect(() => {
        if (execute) {
            setTimeout(() => {
                setExecute(false);
            }, 0);
        }
    }, [execute]);

    // Não me pergunte como, só sei que isso resolve o bug das tabelas não carregarem de primeira
    useEffect(() => {
        if (!isFetching){
            setTimeout(() => {
                setExecute(false);
            }, 0);
        }
    }, [isFetching]);

    updateErrorSync(error);

    return { toggleRequest, data, isLoading, error, isError, isSuccess };
};
