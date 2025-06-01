import RequestSelect from "../../../../../../components/form/select/RequestSelect";
import Input from "../../../../../../components/form/input/Input";
import useEndpoint from "../../../../../../hooks/useEndpoint.ts";
import {TextArea} from "../../../../../../components/form/textarea/Textarea";
import ElementTrader from "../../../../../../components/misc/ElementTrader";

export default function CotacaoProdutoSimilarTrader(){
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
            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <RequestSelect
                    endpoint={(inputValue) => {
                        return useEndpoint().unidade().select(inputValue);
                    }}
                    name={"unidade"}
                    label={"Unidade"} required={true}
                />
                <RequestSelect
                    endpoint={(inputValue) => {
                        return useEndpoint().marca().select(inputValue);
                    }}
                    name={"marca"}
                    label={"Marca"}
                />
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <TextArea label={"Descrição"} name={"descricao"} required={false} minLength={3} maxLength={255} />
                <TextArea label={"Observação"} name={"observacao"} required={false} minLength={3} maxLength={255} />
            </div>
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
            />
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().marca().select(inputValue);
                }}
                name={"marca"}
                label={"Marca"}
            />
            <TextArea label={"Observação"} name={"observacao"} required={false} minLength={3} maxLength={255} />
        </div>
    );

    return (
        <ElementTrader
            primary={{
                title: "Produto",
                element: produtoElement
            }}
            secondary={{
                title: "Similar",
                element: similarElement
            }}
        />
    );
}
