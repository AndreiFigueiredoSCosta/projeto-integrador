import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../hooks/useFetch.ts";
import {PopupBadge} from "../../default/PopupBadge";
import {ReactNode} from "react";
import randomKey from "../../../../../utils/randomKey.ts";
import {P} from "../../../../text/P";
import {Loading} from "../../../Loading";
import {useErrorHandling} from "../../../../../hooks/useErrorHandling.ts";
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
export function ProdutoUltimosPedidosBadge({
                               produtoId,
                               enabledPopup = true,
                               disabled = false
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
                                    <div style={{
                                        marginBottom: "8px",
                                        marginTop: "8px",
                                        padding: "8px",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center"

                                    }}>
                                    <PedidoCard data={pedido} key={randomKey()} />
                                    </div>
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
            badgeText={"Últimos Pedidos"}
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


function PedidoCard({ data }: { data: ProdutoUltimosPedidosResponseData }) {
    return (
        <div style={{
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid var(--preto-75-transparente)",
            width: "230px",
            backgroundColor: "var(--branco)",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column"
        }}>
            {/* Cabeçalho */}
            <div style={{
                backgroundColor: "var(--preto)",
                color: "white",
                textAlign: "center",
                padding: "10px",
                fontWeight: "bold",
                textTransform: "uppercase"
            }}>
                Pedidos
            </div>

            {/* Corpo do card */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
                gap: "8px"
            }}>
                {/* Linha 1: Solicitante e Unidade */}
                <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                    <InfoBox title="Solicitante" content={data.solicitante} />
                    <InfoBox title="Unidade" content={data.unidadeDestino} />
                </div>

                {/* Linha 2: Datas */}
                <div style={{
                    display: "flex",
                    gap: "8px",
                    width: "100%",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <InfoBox title="Emissão" content={formatToDate(data.dataEmissao)} />
                    <InfoBox title="Prev. Entrega" content={formatToDate(data.prevEntrega)} />
                    <InfoBox title="Recebimento" content={formatToDate(data.dataRecebimento)} />
                </div>
            </div>
        </div>
    );
}

function InfoBox({ title, content }: { title: string; content: string }) {
    return (
        <div style={{
            flex: "1",
            backgroundColor: "#F0F0F0",
            borderRadius: "6px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            minHeight: "60px",
            minWidth: "90px"
        }}>
            <P variant="small" uppercase bold>{title}</P>
            <P variant="small" uppercase>{content}</P>
        </div>
    );
}

