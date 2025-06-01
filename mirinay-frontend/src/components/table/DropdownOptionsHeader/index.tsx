import {BlankHeader} from "../BlankHeader";
import {ActionButton} from "../../buttons/action/ActionButton";

import './style.css';

type DropdownOptionsHeaderProps = {
    onDetailsClick: () => void;
    onInsertClick: () => void;
};

export default function DropdownOptionsHeader({ onDetailsClick, onInsertClick } : DropdownOptionsHeaderProps){
    return (
        <BlankHeader>
            <div className={"doh-limiter"}>
                <ActionButton variant={"details"} size={"small"} onClick={onDetailsClick}>Detalhes</ActionButton>
                <ActionButton variant={"details"} size={"small"} onClick={onInsertClick}>Inserir</ActionButton>
            </div>
        </BlankHeader>
    );
}
