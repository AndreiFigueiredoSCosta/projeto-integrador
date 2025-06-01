import { useEffect, useState} from "react";
import {ViewTrader} from "../ViewTrader";
import ElementForElementTrader from "../../../models/misc/ElementForElementTrader.ts";
import './style.css';

type elementTraderProps = {
    primary?: ElementForElementTrader;
    secondary?: ElementForElementTrader;
    tertiary?: ElementForElementTrader;
}

export default function ElementTrader ({primary, secondary, tertiary} : elementTraderProps){
    const [selected, setSelected] = useState<string | undefined>(primary?.title);

    const handleActivation = (element: ElementForElementTrader | undefined) => {
        if (element?.isActivated){
            setSelected(element.title);
        }
    }

    useEffect(() => {
        handleActivation(primary);
        handleActivation(secondary);
        handleActivation(tertiary);
    }, [primary, secondary, tertiary]);

    const VTAux = ({element} : {element: ElementForElementTrader | undefined}) => {
        if (!element){
            return null;
        }

        return (
            <ViewTrader
                size={"small"}
                onClick={() =>{
                    setSelected(element.title)
                }}
                disabled={!(selected === element.title)}
            >
                {element.title}
            </ViewTrader>
        );
    }

    const ElementAux = ({element} : {element: ElementForElementTrader | undefined}) => {
        return (
            <>
                {selected === element?.title && element?.element}
            </>
        );
    }

    return (
        <div className={"element-trader"}>
            <div className="element-trade-manager">
                <VTAux element={primary}/>
                <VTAux element={secondary}/>
                <VTAux element={tertiary}/>
            </div>
            <ElementAux element={primary}/>
            <ElementAux element={secondary}/>
            <ElementAux element={tertiary}/>
        </div>
    );
}
