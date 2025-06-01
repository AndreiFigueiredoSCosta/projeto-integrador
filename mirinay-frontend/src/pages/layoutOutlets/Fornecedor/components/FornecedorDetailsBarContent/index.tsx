import {useNavigate} from "react-router-dom";
import ReturnButton from "../../../../../components/buttons/misc/ReturnButton";
import {DetailsInteraction} from "../../../../../components/misc/DetailsInteraction";

import "./style.css";

type GrupoDetailsBarContentProps = {
    onDeleteClick: () => void;
    onEditClick: () => void;
}

export default function FornecedorDetailsBarContent ( { onDeleteClick, onEditClick } : GrupoDetailsBarContentProps ){
    const navigate = useNavigate();

    return (
        <div className={"grupo-details-bar-content"}>
            <div>
                <ReturnButton onClick={() => navigate("/fornecedor")}> voltar </ReturnButton>
            </div>
            <div>
                <DetailsInteraction onClick={onEditClick} icon={"editar"} variant={"alt-green"}>Editar</DetailsInteraction>
                <DetailsInteraction onClick={onDeleteClick} icon={"excluir"} variant={"red"}>Excluir</DetailsInteraction>
            </div>
        </div>
    );
}
