import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import {useFetch} from "../../../../../hooks/useFetch.ts";
import {PopupBadge} from "../../default/PopupBadge";
import {ReactNode} from "react";
import randomKey from "../../../../../utils/randomKey.ts";
import {P} from "../../../../text/P";
import {Loading} from "../../../Loading";
import {useErrorHandling} from "../../../../../hooks/useErrorHandling.ts";

type StageBadgeProps = {
    enabledPopup?: boolean;
    disabled?: boolean;
    id: number;
    type?: "fornecedor" | "item"
};

export function AlertasBadge({
                               id,
                               type = "item",
                               enabledPopup = true,
                               disabled = false
}: StageBadgeProps) {
    const preEndpoint = useEndpoint().alerta();
    let endpoint = "";
    switch (type){
        case "item":
            endpoint = `${preEndpoint.item(id).get}`
            break;
        case "fornecedor":
            endpoint = `${preEndpoint.fornecedor(id).get}`
            break;
        default:
            console.error("Invalid alert type");
            break;
    }

    const { data, isLoading, isError, error, isSuccess, toggleRequest } = useFetch(endpoint, undefined, undefined, {
        staleTime: 5000,
        retry: false,
        queryKey: [endpoint]
    });

    const badgeContent = (): ReactNode => {
        const mappedData = data as {
            alertaId: number,
            itemId: number,
            alerta: string
        }[];

        if (mappedData?.length === 0) {
            return (
                <P
                    variant={"medium"}
                    justify={"center"}
                    align={"middle"}
                    color={"blank"}
                    uppercase={true}
                >
                    Nenhum alerta
                </P>
            );
        }
        else if (isLoading) {
            return <Loading />
        }
        else if (isError) {
            return (
                <P
                    variant={"medium"}
                    justify={"center"}
                    align={"middle"}
                    color={"blank"}
                    uppercase={true}
                >
                    Erro ao carregar alertas
                </P>
            );
        }
        else if (isSuccess) {
            return (
                        <>
                            {mappedData?.map((alerta) => {
                                return (
                                    <div key={randomKey()}
                                         style={{
                                             width: '100%',
                                             minHeight: mappedData.length > 4 ? "10px" : "15px",
                                             height: 'fit-content',
                                             padding: '2px',
                                         }}
                                    >
                                        <P
                                            variant={`${alerta.alerta.length > 50 ? "xsmall" : "small"}`}
                                            justify={"left"}
                                            align={"middle"}
                                            color={"blank"}
                                            uppercase={true}
                                        >
                                            {alerta.alerta}
                                        </P>
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

    useErrorHandling(isError, error, "Erro ao carregar alertas");

    return (
        <PopupBadge
            badgeText={"Alertas"}
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
