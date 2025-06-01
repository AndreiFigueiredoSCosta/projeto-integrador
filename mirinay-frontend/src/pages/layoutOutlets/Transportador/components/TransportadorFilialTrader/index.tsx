import {useEffect, useState} from "react";
import './style.css';
import Input from "../../../../../components/form/input/Input";
import {SelectOption} from "../../../../../types/SelectOption.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import ElementTrader from "../../../../../components/misc/ElementTrader";
import RequestSelect from "../../../../../components/form/select/RequestSelect";
import TransportadorResponseData from "../../../../../models/transportador/response/TransportadorResponseData.ts";
import Switch from "../../../../../components/form/misc/Switch";

type ProdutoSimilarTraderProps = {
    transportador?: TransportadorResponseData;
}

/**
 * Alternador de tipo de cadastro do formulário de submissão de novo/item
 * @constructor
 */
export default function TransportadorFilialTrader( { transportador } : ProdutoSimilarTraderProps){
    const [ selectedItem, setSelectedItem ] = useState<SelectOption | null>(null);

    // Set selected produto
    useEffect(() => {
        if (transportador) {
            setSelectedItem({
                label: transportador?.nome,
                value: transportador?.id
            });
        }

    }, [transportador]);

    const primaryElement = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Input type={"hidden"} label={"submitType"} name={"submitType"} value={"transportador"}/>
            <Input label={"Nome do transportador"} type={'text'} name={'nome'} required={true} minLength={3} maxLength={255}/>
        </div>
    );

    const secondaryElement = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Input type={"hidden"} label={"submitType"} name={"submitType"} value={"cnpj"}/>
            <RequestSelect
                endpoint={(inputValue) => {
                    return useEndpoint().transportador().buscas(inputValue).select;
                }}
                name={"transportador"}
                label={"Transportador"}
                required={true}
                selected={selectedItem}
            />

            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <Input
                    type={'email'}
                    name={'email'}
                    label={'Email'}
                    required={true}
                    minLength={3}
                    maxLength={255}
                />
                <Input
                    type={'text'}
                    name={'apelido'}
                    label={'Apelido do CNPJ'}
                    required={false}
                    minLength={3}
                    maxLength={255}
                />
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
            }}>
                <Input
                    type={'text'}
                    name={'cnpj'}
                    label={'CNPJ'}
                    required={true}
                    minLength={14}
                    maxLength={18}
                />
                <Switch name={"matriz"} defaultChecked={false}>
                    Matriz
                </Switch>
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <Input
                    type={'text'}
                    name={'telefone'}
                    label={'Telefone'}
                    required={true}
                    minLength={9}
                    maxLength={15}
                />
                <Input
                    type={'text'}
                    name={'celular'}
                    label={'Celular'}
                    required={false}
                    minLength={9}
                    maxLength={15}
                />
            </div>
        </div>
    );

    return (
    <ElementTrader
        primary={{
            title: "Novo",
            element: primaryElement
        }}
        secondary={{
            title: "CNPJ",
            element: secondaryElement,
            isActivated: !!transportador
        }}
    />
    );
}
