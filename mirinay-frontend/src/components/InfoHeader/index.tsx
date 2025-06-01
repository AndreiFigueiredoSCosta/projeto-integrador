import './style.css';
import { P } from '../text/P';
import {useEffect, useRef, useState} from 'react';
import randomKey from "../../utils/randomKey.ts";

/**
 * Interface para os itens do header
 * @param text - Texto do item
 * @param color - Cor do item
 * @param icon - Icone do item
 * @param onChange - Função a ser executada ao clicar no item
 */
export interface InfoHeaderItem {
    text: string;
    onChange?: () => void;
    selected?: boolean;
}

interface InfoHeaderProps {
    items: InfoHeaderItem[] | undefined;
}

/**
 * Componente que exibe o header de um stage
 * @param items - Itens do header
 * @constructor
 */
export function InfoHeader({items}: InfoHeaderProps) {
    const [currentInfo, setCurrentInfo] = useState<InfoHeaderItem | undefined>();
    const [infos, setInfos] = useState<InfoHeaderItem[] | undefined>();
    const itemsRef = useRef<InfoHeaderItem[]>();

    useEffect(() => {
        if (!itemsRef.current) {
            itemsRef.current = items;

            setCurrentInfo(items?.filter((item) => item.selected)[0] || items?.[0]);
            setInfos(items);
        }
    }, [items]);

    return (
        <div className='info-header'>
            {infos?.map((item, index) => (
                <div key={randomKey()}
                     className={`info-item ${(item.text == currentInfo?.text || item.selected) && `active`}`}
                     onClick={() => {
                         if (items) {
                             if (items[index].onChange) {
                                 items[index].onChange();
                             }
                         }
                         setCurrentInfo(item);
                     }}
                >
                    <P bold={true}
                       color={"blank"}
                       variant={"medium"}
                       uppercase={true}
                       align={"middle"}
                       justify={"left"}
                    >
                        {item.text}
                    </P>
                </div>
            ))}
        </div>
    );
}
