import "./style.css"
import {RequiredElement} from "../../form/components/RequiredElement";

export default function RequiredWarning(){
    return (
        <div className="required-warning bold">
            Campos marcados com <RequiredElement isRequired={true}/> são obrigatórios
        </div>
    )
}
