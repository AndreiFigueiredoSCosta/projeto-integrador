import {useEffect, useState} from "react";
import './style.css';
import Input from "../../../../../components/form/input/Input";
import {SelectOption} from "../../../../../types/SelectOption.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import ElementTrader from "../../../../../components/misc/ElementTrader";
import RequestSelect from "../../../../../components/form/select/RequestSelect";
import Switch from "../../../../../components/form/misc/Switch";
import FornecedorResponseData from "../../../../../models/fornecedor/response/FornecedorResponseData.ts";
import {Select} from "../../../../../components/form/select/Select";
import EstadosOptions from "../../../../../utils/EstadosOptions.ts";

type ProdutoSimilarTraderProps = {
    fornecedor?: FornecedorResponseData;
}

/**
 * Alternador de tipo de cadastro do formulário de submissão de novo/item
 * @constructor
 */
export default function FornecedorCNPJTrader( { fornecedor } : ProdutoSimilarTraderProps){
    const [ selectedItem, setSelectedItem ] = useState<SelectOption | null>(null);

    // Set selected produto
    useEffect(() => {
        if (fornecedor) {
            setSelectedItem({
                label: fornecedor?.nome,
                value: fornecedor?.id
            });
        }

    }, [fornecedor]);

    const primaryElement = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Input type={"hidden"} label={"submitType"} name={"submitType"} value={"fornecedor"}/>
            <Input label={"Nome do fornecedor"} type={'text'} name={'nome'} required={true} minLength={3} maxLength={255}/>
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
                    return useEndpoint().fornecedor().buscas(inputValue).select;
                }}
                name={"fornecedor"}
                label={"Fornecedor"}
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
                    name={'nome'}
                    label={'Nome Fantasia'}
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
                <Input type={"number"} label={"Pedido Mínimo"} name={"pedidoMinimo"} required={true} min={0} step={0.01}/>
            </div>
            <div style={{
                display: 'flex',
                gap: '10px',
            }}>
                <Select
                    label={"Estado"}
                    options={EstadosOptions}
                    name={"estado"}
                    required={true}
                />
                <Input
                    type={'text'}
                    name={'cidade'}
                    label={'Cidade'}
                    required={false}
                    minLength={3}
                    maxLength={255}
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
                    isActivated: !!fornecedor
                }}
            />
            );
            }
