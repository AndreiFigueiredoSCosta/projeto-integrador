import './style.css';
import { P } from '../text/P';
import {ReactNode, useEffect, useState} from 'react';

/**
 * Interface para os itens do header
 * @param text - Texto do item
 * @param color - Cor do item
 * @param icon - Icone do item
 * @param onChange - Função a ser executada ao clicar no item
 */
export interface Item {
    text: string;
    color: 'red' | 'green' | 'alt-green' | 'yellow';
    icon?: ReactNode;
    onChange?: () => void;
}

interface Props {
    items: Item[] | undefined;
}

/**
 * Componente que exibe o header de um stage
 * @param items - Itens do header
 * @constructor
 */
export function StageHeader({items}: Props) {
    const [currentStage, setCurrentStage] = useState<Item | undefined>();
    const [stages, setStages] = useState<Item[] | undefined>();

    useEffect(() => {
        if (items) {
            setCurrentStage(items[0]);
            setStages(items);
        }
    }, [items]);

    return (
        <div className='stage-header'>
            {stages?.map((item, index) => (
                <div key={index}
                     className={`stage-item ${item.color} ${item == currentStage && `active`}`}
                     onClick={() => {
                         if (items) {
                             if (items[index].onChange) {
                                 items[index].onChange();
                             }
                         }
                         setCurrentStage(item);
                     }}
                >
                    {item.icon}
                    {
                        item == currentStage &&
                        <div className={`item-name`}>
                            <P bold={true}
                               color={"black"}
                               variant={"medium"}
                               uppercase={true}
                               align={"middle"}
                               justify={"left"}
                            >
                                {item.text}
                            </P>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
}
