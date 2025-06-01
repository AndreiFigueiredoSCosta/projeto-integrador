import {Loading} from "../../misc/Loading";
import {P} from "../../text/P";

export default function LoadingTable(){
    return (
        <div>
            <Loading/>
            <P color={"black"}>Carregando dados...</P>
        </div>

    );
}
