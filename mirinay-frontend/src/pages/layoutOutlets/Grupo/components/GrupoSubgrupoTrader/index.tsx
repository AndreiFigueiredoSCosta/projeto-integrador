import { useEffect, useState} from "react";

import './style.css';
import Input from "../../../../../components/form/input/Input";
import {SelectOption} from "../../../../../types/SelectOption.ts";
import useEndpoint from "../../../../../hooks/useEndpoint.ts";
import GrupoResponseData from "../../../../../models/grupo/response/GrupoResponseData.ts";
import ElementTrader from "../../../../../components/misc/ElementTrader";
import RequestSelect from "../../../../../components/form/select/RequestSelect";

type GrupoSubgrupoTraderProps = {
    grupo?: GrupoResponseData;
}

/**
 * Alternador de tipo de cadastro do formulário de submissão de grupo/subgrupo
 * @param grupo - Dados do grupo a ser inserido no selecto
 * @constructor
 */
export default function GrupoSubgrupoTrader( { grupo } : GrupoSubgrupoTraderProps){
    const [ selectedGrupo, setSelectedGrupo ] = useState<SelectOption | null>(null);

    const grupoElement = (
        <>
            <Input type={"hidden"} label={"submitType"} name={"submitType"} value={"grupo"} required={true} disabled={false}/>
            <Input label={"Nome do grupo"} type={'text'} name={'nome'} required={true} disabled={false}/>
        </>
    );

    const subgrupoElement = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        }}>
            <Input type={"hidden"} label={"submitType"} name={"submitType"} value={"subgrupo"} required={true} disabled={false}/>
            <RequestSelect
                label={"Grupo"}
                name={'grupo'}
                selected={selectedGrupo}
                required={true}
                endpoint={(inputValue) => {
                    return useEndpoint().grupo().buscas(inputValue).select
                }}
            />
            <Input type={'text'} name={'nome'} label={'Nome do Subgrupo'} required={true}/>
        </div>
    );

    // Set selected grupo
    useEffect(() => {
        if (grupo) {
            setSelectedGrupo({
                label: grupo.nome,
                value: grupo.codigo
            });
        }

    }, [grupo]);

    return (
        <ElementTrader
            primary={{
                title: "Grupo",
                element: grupoElement
            }}
            secondary={{
                title: "Subgrupo",
                element: subgrupoElement,
                isActivated: !!grupo
            }}
        />
    );
}
