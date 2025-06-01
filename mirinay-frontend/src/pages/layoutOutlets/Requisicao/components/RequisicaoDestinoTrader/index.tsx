import Input from "../../../../../components/form/input/Input";
import ElementTrader from "../../../../../components/misc/ElementTrader";
import DestinoEnum from "../../../../../enums/DestinoEnum.ts";
import RequestSelect from "../../../../../components/form/select/RequestSelect";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";

/**
 * Alternador de tipo de cadastro do formulário de submissão de requisição
 * @constructor
 */
export default function RequisicaoDestinoTrader(){
    const estoqueElement = (
        <>
            <Input label={"Nome da Requisicao"} type={'text'} name={'nome'} required={true} disabled={false}/>
            <Input type={"hidden"} label={"destino"} name={"destino"} required={true} value={DestinoEnum.ESTOQUE}/>
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().unidade().select(inputValue);
                }}
                name={"unidade"}
                label={"Unidade"} required={true}
            />
         </>
    );

    const vendaElement = (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <Input type={"hidden"} label={"destino"} name={"destino"} required={true} value={DestinoEnum.VENDA}/>
            <Input type={'text'} name={'nome'} label={'Nome da Requisicao'} required={true}/>
            <Input type={'text'} name={'cliente'} label={'Nome do Cliente'} required={true}/>
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().unidade().select(inputValue);
                }}
                name={"unidade"}
                label={"Unidade"} required={true}
            />
        </div>
    );

    return (
        <ElementTrader
            primary={{
                title: DestinoEnum.VENDA,
                element: vendaElement
            }}
            secondary={{
                title: DestinoEnum.ESTOQUE,
                element: estoqueElement,
            }}
        />
    );
}
