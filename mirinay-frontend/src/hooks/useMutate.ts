import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axios, { AxiosRequestConfig } from 'axios';
import { useAccessToken } from './useAccessToken.ts';
import {useState} from 'react';
import ErrorResponse from "../models/misc/ErrorResponse.ts";

const API_URL = process.env.API_URL || '';

interface UseMutationResultType<T> {
    execute: (body: Record<string | symbol, unknown>) => void;
    data: T | null;
    isLoading: boolean;
    abort: () => void;
    error: Error | null;
    isError: boolean;
    isSuccess: boolean;
}

/**
 * Hook para fazer requisições HTTP de adição ou alteração (POST, PUT, DELETE).
 * @param request - URL da requisição.
 * @param options - Opções da requisição.
 * @param mutationOptions - Opções do React Query.
 * @returns UseMutationResultType<T> - Dados e funções para executar a requisição.
 */
export const useMutate = <T>(request: string, options?: AxiosRequestConfig,
                                   mutationOptions?: UseMutationOptions<T, Error,
                                       Record<string | symbol, unknown>>): UseMutationResultType<T> => {
    const abortController = new AbortController();
    const accessToken = useAccessToken();
    const [ isSuccess, setIsSuccess ] = useState<boolean>(false);
    const [ errorResponse, setErrorResponse ] = useState<ErrorResponse | null>(null);

    const headers: Record<string, string> = {
        ...Object.fromEntries(Object.entries(options?.headers || {}).map(([key, value]) => [key, String(value)])),
    };

    const updateError = (error?: Error | null) => {
        if (error && errorResponse) {
            error.name = errorResponse.mensagem;
            error.message = errorResponse?.detalhes;
        }
    }

    const updateErrorSync = (error?: Error | null) => {
        return updateError(error);
    }

    // Adiciona o token de autenticação no cabeçalho da requisição.
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Função para fazer a requisição HTTP.
    const mutateFunction = async (body?: Record<string | symbol, unknown>): Promise<T> => {
        setIsSuccess(false);
        console.log('Requesting:', request);
        console.log(body);
        try{
            const response = await axios({
                url: `${API_URL}${request}`,
                method: options?.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                data: body,
                ...options,
                timeout: 20000,
            });
            setIsSuccess(true);
            return response.data as T;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setErrorResponse(error.response.data as ErrorResponse);
            }
            throw error;
        }
    }

    // Executa a requisição HTTP.
    const { mutate: execute, data = null, error, isPending: isLoading, isError } = useMutation<T, Error, Record<string | symbol, unknown>>({
        mutationFn: mutateFunction,
        ...mutationOptions,
    });

    // Aborta a requisição caso esteja pendente.
    const abort = () => {
        abortController.abort();
        console.log(`Requisição abortada: ${API_URL}${request}`);
    };

    updateErrorSync(error);

    return { execute, data, isLoading, abort, error, isError, isSuccess };
};
