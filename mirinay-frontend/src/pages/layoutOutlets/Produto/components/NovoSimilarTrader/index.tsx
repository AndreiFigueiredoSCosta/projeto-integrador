import {useEffect, useState} from "react";
import './style.css';
import Input from "../../../../../components/form/input/Input";
import {SelectOption} from "../../../../../types/SelectOption.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import ProdutoResponseData  from "../../../../../models/produto/response/ProdutoResponseData.ts";
import { TextArea } from "../../../../../components/form/textarea/Textarea";
import ElementTrader from "../../../../../components/misc/ElementTrader";
import RequestSelect from "../../../../../components/form/select/RequestSelect";

type ProdutoSimilarTraderProps = {
    produto?: ProdutoResponseData;
}

/**
 * Alternador de tipo de cadastro do formulário de submissão de novo/item
 * @param produto - Dados do produto a ser inserido no selecto
 * @constructor
 */
export default function NovoSimilarTrader( { produto } : ProdutoSimilarTraderProps){
    const [ selectedProduto, setSelectedProduto ] = useState<SelectOption | null>(null);

    // Set selected produto
    useEffect(() => {
        if (produto) {
            setSelectedProduto({
                label: produto.nome,
                value: produto.id
            });
        }

    }, [produto]);

    const produtoElement = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Input type={"hidden"} label={"submitType"} name={"submitType"} value={"produto"}/>
            <Input label={"Nome do produto"} type={'text'} name={'nome'} required={true} minLength={3} maxLength={255}/>
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().subgrupo().buscas(inputValue).select
                }}
                name={"subgrupo"}
                label={"Subgrupo"} required={true}
            />
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().unidade().select(inputValue);
                }}
                name={"unidade"}
                label={"Unidade"} required={true}
            />
            <TextArea label={"Descrição"} name={"descricao"} required={false} minLength={3} maxLength={255} />
        </div>
    );

    const similarElement = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Input type={"hidden"} label={"submitType"} name={"submitType"} value={"similar"}/>
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().produto().buscar(inputValue).select;
                }}
                name={"produto"}
                label={"Produto"}
                required={true}
                selected={selectedProduto}
            />
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().marca().select(inputValue);
                }}
                name={"marca"}
                label={"Marca"}
            />
            <Input
                type={'text'}
                name={'referencia'}
                label={'Referência'}
                required={true}
                minLength={3}
                maxLength={255}
            />
            <TextArea label={"Observação"} name={"observacao"} required={false} />
        </div>
    );

    return (
        <ElementTrader
            primary={{
                title: "Novo",
                element: produtoElement
            }}
            secondary={{
                title: "Similar",
                element: similarElement,
                isActivated: !!produto
            }}
        />
    );
}
