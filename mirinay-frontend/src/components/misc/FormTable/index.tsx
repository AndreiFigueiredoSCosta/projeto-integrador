import React, {memo, useEffect, useState} from "react";
import {useFetch} from "../../../hooks/useFetch.ts";
import {useErrorHandling} from "../../../hooks/useErrorHandling.ts";
import {P} from "../../text/P";
import useFormTableContent from "../../../hooks/useFormTableContent.tsx";
import FormTableRow from "../FormTableRow";
import JSONType from "../../../models/misc/JSONType.ts";

type types = {
    topText: string,
    endpoint: string,
    doRequest?: boolean,
    errorMessage: string,
    alreadySelectedChecks?: number[],
    setSelectedChecks: React.Dispatch<React.SetStateAction<number[]>>,
    idReference: string,
    nameReference: string,
    auxNameReference?: string
}
const FormTable = memo(function FormTable({
                                                                    topText,
                                                                    endpoint,
                                                                    alreadySelectedChecks,
                                                                    idReference,
                                                                    nameReference,
                                                                    auxNameReference,
                                                                    errorMessage,
                                                                    setSelectedChecks,
                                                                    doRequest = false
                                                                    }: types) {
    const {data, isLoading, isError, error, toggleRequest} = useFetch(endpoint);
    const [traderIds, setTraderIds] = useState<number[]>([]);

    useEffect(() => {
        if (doRequest) {
            toggleRequest();
        }
    }, [doRequest, toggleRequest]);

    useEffect(() => {
        setSelectedChecks(traderIds)
    }, [traderIds]);

    useErrorHandling(isError, error, errorMessage);

    const contentFunction = (dados: JSONType) => {
        const dataObj = dados as JSONType;
        return (
            <FormTableRow
                includes={traderIds.includes(dataObj[idReference] as number)}
                setSelectedChecks={setTraderIds}
                rowId={dataObj[idReference] as number}
                isPresent={alreadySelectedChecks?.includes(dataObj[idReference] as number)}
            >
                {dataObj[nameReference] as string} {auxNameReference && ` - ${dataObj[auxNameReference]}`}
            </FormTableRow>
        );
    }

    const tableContent = useFormTableContent<JSONType>({
        data: data as JSONType[],
        isLoading,
        error,
        isError,
        errorMessage,
        contentFunction
    })

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "0"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                borderRadius: "5px 5px 0 0",
                padding: "5px 10px",
                alignContent: "center",
                justifyContent: "center",
                border: "1px solid var(--preto-75-transparente)",
                width: "50%",
                marginLeft: "5px",
                borderBottom: "none"
            }}>
                <P variant={"medium"} bold={true} color={"black"} uppercase={true}>
                    {topText}
                </P>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                overflowY: "auto",
                minHeight: "100px",
                maxHeight: "250px",
                backgroundColor: "var(--branco-5-escuro)",
                borderRadius: "5px",
                width: "100%",
                border: "1px solid var(--preto-75-transparente)",
            }}>
                {tableContent}
            </div>
        </div>
    );
});

export default FormTable;
