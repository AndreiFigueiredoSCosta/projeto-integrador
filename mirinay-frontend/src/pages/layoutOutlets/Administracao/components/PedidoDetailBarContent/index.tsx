import {useNavigate} from "react-router-dom";
import ReturnButton from "../../../../../components/buttons/misc/ReturnButton";

import "./style.css";
import {StageBadge} from "../../../../../components/misc/badges/default/StageBadge";
import NfeEnum from "../../../../../enums/NfeEnum.ts";

type PedidoDetailsBarContentProps = {
    data: NfeEnum | undefined;
    pedidoId: number;
}

export default function PedidoDetailsBarContent ({data}: PedidoDetailsBarContentProps) {
    const navigate = useNavigate();

    return (
        <div className={"grupo-details-bar-content"}>
            <div>
                <ReturnButton onClick={() => navigate("/pedidos/concluidos")}> voltar </ReturnButton>
                <StageBadge variant={data == NfeEnum.ENCONTRADA ? "green" : "yellow"} outline={true} children={data}/>
            </div>
            <div>
            </div>
        </div>
    );
}

