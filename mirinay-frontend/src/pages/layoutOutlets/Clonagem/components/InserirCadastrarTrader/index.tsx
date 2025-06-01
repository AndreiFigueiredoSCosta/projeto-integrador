import React, {memo, useEffect, useState} from "react";

import Input from "../../../../../components/form/input/Input";
import {SelectOption} from "../../../../../types/SelectOption.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import ElementTrader from "../../../../../components/misc/ElementTrader";
import ClonagemResponseData from "../../../../../models/clonagem/response/ClonagemResponseData.ts";
import SimilarFornecedorTrader from "../SimilarFornecedorTrader";
import RequestSelect from "../../../../../components/form/select/RequestSelect";

type InserirCadastrarTraderProps = {
    clonagem?: ClonagemResponseData;
    setSimilares: React.Dispatch<React.SetStateAction<number[]>>
}

/**
 * Alternador de tipo de cadastro do formulário de submissão de clonagem
 * @param clonagem - Dados da clonagem
 * @param setSimilares - Função para setar os similares
 * @param similares - Lista de similares
 * @constructor
 */
const InserirCadastrarTrader = memo( function InserirCadastrarTrader( { clonagem, setSimilares } : InserirCadastrarTraderProps){
    const [ selectedClonagem, setSelectedClonagem ] = useState<SelectOption | null>(null);

    const inserirElement = (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <Input
                type={"hidden"}
                label={"submitType"}
                name={"submitType"}
                value={"inserir"}
                required={true}
            />
            <RequestSelect
                label={"Clonagem"}
                name={'clonagem'}
                required={true}
                selected={selectedClonagem}
                onSelect={(value) => setSelectedClonagem(value)}
                endpoint={(inputValue) => useEndpoint().clonagem().select(inputValue).clonagem}
            />
            {
                selectedClonagem &&
                <SimilarFornecedorTrader setSimilares={setSimilares} clonagemId={selectedClonagem.value as unknown as number} />
            }
        </div>
    );

    const cadastrarElement = (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <Input
                type={"hidden"}
                label={"submitType"}
                name={"submitType"}
                value={"cadastrar"}
                required={true}
            />
            <Input
                type={'text'}
                name={'nomeClonagem'}
                label={'Nome da Clonagem'}
                required={true}
            />
        </div>
    );

    // Set selected clonagem
    useEffect(() => {
        if (clonagem) {
            setSelectedClonagem({
                label: clonagem.nome,
                value: clonagem.clonagemId
            });
        }

    }, [clonagem]);

    return (
        <ElementTrader
            primary={{
                title: "Inserir",
                element: inserirElement,
                isActivated: !!clonagem
            }}
            secondary={{
                title: "Cadastrar",
                element: cadastrarElement
            }}
        />
    );
});

export default InserirCadastrarTrader;
