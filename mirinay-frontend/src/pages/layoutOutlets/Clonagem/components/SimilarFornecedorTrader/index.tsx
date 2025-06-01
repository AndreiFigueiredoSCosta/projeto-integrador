import React, {memo, useEffect, useState} from "react";

import Input from "../../../../../components/form/input/Input";
import {SelectOption} from "../../../../../types/SelectOption.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import ElementTrader from "../../../../../components/misc/ElementTrader";
import RequestSelect from "../../../../../components/form/select/RequestSelect";
import {useFetch} from "../../../../../hooks/useFetch.ts";
import FormTable from "../../../../../components/misc/FormTable";

type SimilarFornecedorTraderProps = {
    setSimilares: React.Dispatch<React.SetStateAction<number[]>>,
    clonagemId?: number
}

/**
 * Alternador de tipo de inserção do formulário de submissão de clonagem
 * @constructor
 */
const SimilarFornecedorTrader = memo(function SimilarFornecedorTrader({
                                                                          setSimilares,
                                                                          clonagemId
                                                                      }: SimilarFornecedorTraderProps) {
    const [selectedProduto, setSelectedProduto] = useState<SelectOption | null>(null);
    const endpoint = useEndpoint().clonagem(clonagemId).todosSimilares;
    const { data, toggleRequest } = useFetch<number>(endpoint);

    useEffect(() => {
        toggleRequest();
    }, [toggleRequest]);

    const produtoElement = (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <Input
                type={"hidden"}
                label={"insertType"}
                name={"insertType"}
                value={"produto"}
                required={true}
            />
            <RequestSelect
                label={"Produto"}
                name={'produto'}
                required={true}
                onSelect={(value) => setSelectedProduto(value)}
                selected={selectedProduto}
                endpoint={(inputValue) => useEndpoint().produto().buscar(inputValue).select}
            />
            {
                selectedProduto &&
                <FormTable
                    idReference={"idSimilar"}
                    nameReference={"codigoReferencia"}
                    auxNameReference={"marca"}
                    endpoint={useEndpoint().produto().informacoes(selectedProduto.value as unknown as number).similares}
                    setSelectedChecks={setSimilares}
                    alreadySelectedChecks={data as number[]}
                    topText={`Similares de ${selectedProduto.label}`}
                    errorMessage={"Erro ao carregar produtos similares"}
                    doRequest={true}
                />
            }
        </div>
    );

    const fornecedorElement = (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <Input
                type={"hidden"}
                label={"insertType"}
                name={"insertType"}
                value={"fornecedor"}
                required={true}
            />
            <RequestSelect
                label={"Fornecedor"}
                name={'fornecedor'}
                required={true}
                endpoint={(inputValue) => useEndpoint().fornecedor().buscas(inputValue).select}
            />
        </div>
    );

    return (
        <ElementTrader
            primary={{
                title: "Produto",
                element: produtoElement,
            }}
            secondary={{
                title: "Fornecedor",
                element: fornecedorElement
            }}
        />
    );
});

export default SimilarFornecedorTrader;
