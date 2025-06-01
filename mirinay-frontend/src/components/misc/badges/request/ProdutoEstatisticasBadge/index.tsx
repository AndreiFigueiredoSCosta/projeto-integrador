import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../hooks/useFetch.ts";
import {PopupBadge} from "../../default/PopupBadge";
import {ReactNode} from "react";
import randomKey from "../../../../../utils/randomKey.ts";
import {P} from "../../../../text/P";
import {Loading} from "../../../Loading";
import {useErrorHandling} from "../../../../../hooks/useErrorHandling.ts";
import PopupCard from "../../components/PopupCard";
import formatToDate from "../../../../../utils/formatToDate.ts";

type StageBadgeProps = {
    enabledPopup?: boolean;
    disabled?: boolean;
    produtoId: number;
};

interface ProdutoUltimosPedidosResponseData {
    nomeFornecedor: string,
    solicitante: string,
    unidadeDestino: string,
    prevEntrega: string,
    dataEmissao: string,
    dataRecebimento: string,
}
export function ProdutoEstatisticasBadge({
                               produtoId,
                               enabledPopup = true,
                               disabled = true
}: StageBadgeProps) {
    const endpoint = `${useEndpoint().produto().informacoes(produtoId).getUltimosPedidos}`;
    const { data, isLoading, isError, error, isSuccess, toggleRequest } = useFetch(endpoint, undefined, undefined, {
        retry: false,
        staleTime: 10000,
        queryKey: [endpoint]
    });

    const badgeContent = (): ReactNode => {
        const mappedData = data as ProdutoUltimosPedidosResponseData[];

        if (mappedData?.length === 0) {
            return (
                <P
                    variant={"small"}
                    justify={"center"}
                    align={"middle"}
                    color={"blank"}
                    uppercase={true}
                >
                    Sem últimos pedidos!
                </P>
            );
        }
        else if (isLoading) {
            return <Loading />
        }
        else if (isError) {
            return (
                <P
                    variant={"small"}
                    justify={"center"}
                    align={"middle"}
                    color={"blank"}
                    uppercase={true}
                >
                    Erro ao carregar últimos pedidos
                </P>
            );
        }
        else if (isSuccess) {
            return (
                        <>
                            {mappedData?.map((pedido) => {
                                return (
                                    <PedidoCard data={pedido} key={randomKey()} />
                                );
                            })}
                        </>
                    );
        }
        else{
            return (
                <P
                    variant={"medium"}
                    justify={"center"}
                    align={"middle"}
                    color={"blank"}
                    uppercase={true}
                >
                    DESCULPE, OCORREU UM ERRO...
                </P>
            );
        }
    }

    useErrorHandling(isError, error, "Erro ao carregar últimos pedidos!");

    return (
        <PopupBadge
            badgeText={"Estatísticas"}
            enabledPopup={enabledPopup}
            disabled={disabled}
            onMouseEnter={() => {
                if (!disabled && !isLoading && enabledPopup) {
                    toggleRequest();
                }
            }}
        >
            {badgeContent()}
        </PopupBadge>
    );
}


function PedidoCard ({data}: {data: ProdutoUltimosPedidosResponseData}) {
    const InfoContainer = ({children}: { children: ReactNode }) => {
        return (
            <div
                style={{
                    backgroundColor: "var(--branco-5-escuro)",
                    display: "flex",
                    gap: "5px",
                    flex: "1",
                    borderRadius: "5px",
                }}
            >
                {children}
            </div>
        );
    }

    const InfoRow = ({content, title}: { content: string, title: string }) => {
        return (
            <div
                style={{
                    display: "flex",
                    padding: "0 5px"
                }}
            >
                <div
                    style={{
                        minHeight: "20px",
                        height: "fit-content",
                        flex: "1",
                        maxHeight: "40px",
                        padding: "0 5px",
                        borderRight: "1px solid var(--preto-75-transparente)"
                    }}
                >
                    <P
                        variant={"small"}
                        align={"middle"}
                        justify={"right"}
                        uppercase={true}
                        bold={true}
                    >
                        {title}
                    </P>
                </div>
                <div
                    style={{
                        minHeight: "20px",
                        height: "fit-content",
                        flex: "1",
                        maxHeight: "40px",
                        padding: "0 5px"
                    }}
                >
                    <P
                        variant={"small"}
                        align={"middle"}
                        justify={"center"}
                        uppercase={true}
                    >
                        {content}
                    </P>
                </div>
            </div>
        )
    }

    return (
        <PopupCard title={data.nomeFornecedor}>
            <InfoContainer>
                <InfoRow content={data.solicitante} title={"solicitante"}/>
                <InfoRow content={data.unidadeDestino} title={"unidade"}/>
            </InfoContainer>
            <InfoContainer>
                <InfoRow content={formatToDate(data.dataEmissao)} title={"emissão"}/>
                <InfoRow content={formatToDate(data.prevEntrega)} title={"prev. entrega"}/>
                <InfoRow content={formatToDate(data.dataRecebimento)} title={"recebimento"}/>
            </InfoContainer>
        </PopupCard>
    );
}
